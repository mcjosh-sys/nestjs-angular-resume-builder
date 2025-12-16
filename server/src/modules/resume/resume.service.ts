import {
  canCreateResumes as canCreateResume,
  canUseCustomizationFeatures,
} from '@/common/helpers/resume/permission.helper';
import {
  generateFileUrl,
  deleteFile as removeFile,
} from '@/lib/file-upload/core';
import { PrismaService } from '@/prisma/prisma.service';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { stripeConfig } from '../stripe/config';
import { StripeService } from '../stripe/stripe.service';
import { ResumeDto } from './dto/resume.dto';

@Injectable()
export class ResumeService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(stripeConfig.KEY)
    private readonly stripe: StripeService,
  ) {}

  async findAll(userId: string) {
    const resumes = await this.prisma.resume.findMany({
      where: { userId },
      include: { workExperiences: true, educations: true },
      orderBy: { updatedAt: 'desc' },
    });

    return resumes.map((resume) => {
      const { photoUrl, ...rest } = resume;
      const photo = photoUrl ? generateFileUrl(photoUrl) : null;
      return plainToInstance(ResumeDto, { ...rest, photo });
    });
  }

  async findOne(id: string, userId: string) {
    return await this.prisma.resume.findUnique({
      where: { id, userId },
      include: { workExperiences: true, educations: true },
    });
  }

  async getCount(userId: string) {
    return await this.prisma.resume.count({ where: { userId } });
  }

  async save(
    userId: string,
    resume: ResumeDto,
    uploadedPhoto: Express.Multer.File,
  ) {
    const { id, photo, ...rest } = resume;

    const existingResume = id ? await this.findOne(id, userId) : null;

    if (id && !existingResume) {
      throw new NotFoundException('Resume not found');
    }

    const subscription = await this.stripe.getSubscription(userId);
    const resumeCount = await this.prisma.resume.count({ where: { userId } });

    if (!id) {
      if (!canCreateResume(subscription.level, resumeCount)) {
        if (uploadedPhoto) await removeFile(uploadedPhoto.filename);
        throw new ForbiddenException(
          'Maximum resume count reached for this subscription level',
        );
      }
    }

    const hasCustomizations =
      (resume.borderStyle &&
        resume.borderStyle !== existingResume?.borderStyle) ||
      (resume.colorHex && resume.colorHex !== existingResume?.colorHex);

    if (hasCustomizations && !canUseCustomizationFeatures(subscription.level)) {
      throw new ForbiddenException(
        'Customizations not allowed for this subscription level',
      );
    }

    let photoUrl: string | null | undefined = existingResume?.photoUrl;

    if (uploadedPhoto && photoUrl) {
      await removeFile(photoUrl);
    } else if ((photo === null || photo === 'null') && photoUrl) {
      await removeFile(photoUrl);
      photoUrl = null;
    }

    photoUrl = uploadedPhoto?.filename ?? photoUrl;
    rest['photoUrl'] = photoUrl;

    let savedResume!: ResumeDto;

    if (id) {
      savedResume = await this.update(id, userId, rest);
    } else {
      savedResume = await this.create(userId, rest);
    }

    return savedResume;
  }

  async create(userId: string, data: ResumeDto) {
    const { workExperiences, educations, ...rest } = data;
    const { photoUrl, ...savedResume } = await this.prisma.resume.create({
      data: {
        ...rest,
        userId,
        workExperiences: { create: workExperiences },
        educations: { create: educations },
      },
      include: { workExperiences: true, educations: true },
    });

    return plainToInstance(ResumeDto, { ...savedResume, photo: photoUrl });
  }

  async update(id: string, userId: string, data: ResumeDto) {
    const { workExperiences, educations, ...rest } = data;
    const { photoUrl, ...savedResume } = await this.prisma.resume.update({
      where: { id },
      data: {
        ...rest,
        userId,
        workExperiences: {
          deleteMany: {},
          create: workExperiences,
        },
        educations: {
          deleteMany: {},
          create: educations,
        },
      },
      include: { workExperiences: true, educations: true },
    });

    return plainToInstance(ResumeDto, { ...savedResume, photo: photoUrl });
  }

  async remove(id: string, userId: string) {
    const resume = await this.findOne(id, userId);
    if (!resume) throw new NotFoundException('Resume not found');
    return await this.prisma.resume
      .delete({ where: { id, userId } })
      .then(async () => {
        if (resume.photoUrl) {
          await removeFile(resume.photoUrl);
        }
      });
  }
}
