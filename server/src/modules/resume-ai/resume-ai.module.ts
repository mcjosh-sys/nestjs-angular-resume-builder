import { GeminiService } from '@/gemini/gemini.service';
import { Module } from '@nestjs/common';
import { ResumeAiController } from './resume-ai.controller';
import { ResumeAiService } from './resume-ai.service';

@Module({
  providers: [ResumeAiService, GeminiService],
  controllers: [ResumeAiController],
})
export class ResumeAiModule {}
