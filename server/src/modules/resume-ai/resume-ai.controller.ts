import { Body, Controller, Post } from '@nestjs/common';
import { GenerateSummaryDto } from './dto/generate-summary.dto';
import { GenerateWorkExperienceDto } from './dto/generate-work-experience.dto';
import { ResumeAiService } from './resume-ai.service';

@Controller('resume/ai')
export class ResumeAiController {
  constructor(private readonly aiService: ResumeAiService) {}

  @Post('generate-summary')
  async generateSummary(@Body() input: GenerateSummaryDto) {
    return await this.aiService.generateSummary(input);
  }

  @Post('generate-work-experience')
  async generateWorkExperience(@Body() input: GenerateWorkExperienceDto) {
    return this.aiService.generateWorkExperience(input);
  }
}
