import { AuthGuard } from '@/common/guards/auth.guard';
import { PrismaService } from '@/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { stripeConfig } from '../stripe/config';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';

@Module({
  controllers: [ResumeController],
  imports: [ConfigModule.forFeature(stripeConfig)],
  providers: [
    ResumeService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class ResumeModule {}
