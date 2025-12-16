import ResponseMessage from '@/common/decorators/response.decorator';
import { ParseBodyToJsonInterceptor } from '@/common/interceptors/parse-body-to-json.interceptor';
import { generateFileUrl, getStorage } from '@/lib/file-upload/core';
import { imageFilter } from '@/lib/file-upload/filters';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Put,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { ResumeDto } from './dto/resume.dto';
import { ResumeService } from './resume.service';

@Controller('resumes')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Get()
  @ResponseMessage('Resumes fetched successfully')
  findAll(@Req() req: Request) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('Unauthorized');
    return this.resumeService.findAll(userId);
  }

  @Get('count')
  async count(@Req() req: Request) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('Unauthorized');
    return this.resumeService.getCount(userId).then((count) => ({ count }));
  }

  @Get(':id')
  @ResponseMessage('Resume fetched successfully')
  async findOne(@Req() req: Request, @Param('id') resumeId: string) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('Unauthorized');
    const resume = await this.resumeService.findOne(resumeId, userId);
    if (!resume) throw new NotFoundException('Resume not found');
    return {
      ...resume,
      photo: resume.photoUrl ? generateFileUrl(resume.photoUrl) : null,
    };
  }

  @Put()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: getStorage('resume-photos'),
      fileFilter: imageFilter,
    }),
    ParseBodyToJsonInterceptor,
  )
  @ResponseMessage('Resume saved successfully')
  async save(
    @Body() resume: ResumeDto,
    @UploadedFile() uploadedPhoto: Express.Multer.File,
    @Req() req: Request,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    return await this.resumeService.save(userId, resume, uploadedPhoto);
  }

  @Delete(':id')
  @ResponseMessage('Resume deleted successfully')
  async remove(@Req() req: Request, @Param('id') resumeId: string) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('Unauthorized');

    return await this.resumeService.remove(resumeId, userId);
  }
}
