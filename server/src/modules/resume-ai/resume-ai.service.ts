import { GeminiService } from '@/gemini/gemini.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { WorkExperienceDto } from '../resume/dto/work-experience.dto';
import { GenerateSummaryDto } from './dto/generate-summary.dto';
import { GenerateWorkExperienceDto } from './dto/generate-work-experience.dto';

@Injectable()
export class ResumeAiService {
  constructor(private readonly gemini: GeminiService) {}

  async generateSummary(input: GenerateSummaryDto) {
    const systemMessage = `
        You sre s job resume generator AI. Your task is to write a professional introduction summary
        for a resume given the user's provided data. Only return the summary and do not include any other information
        in the response. Keep it concise and professional.
        `;

    const userMessage = `
            Please generate a professional resume summary from this data: 

            Job title: ${input.jobTitle || 'N/A'},

            Work experience:
            ${input.workexperinces
              ?.map(
                (exp) => `
                Position: ${exp.position || 'N/A'} at ${exp.company || 'N/A'} f${exp.startDate || 'N/A'}
                to ${exp.endDate || 'Present'}
                
                Description: ${exp.description || 'N/A'},

                `,
              )
              .join('\n\n')}


            Education:
            ${input.educations
              ?.map(
                (edu) => `
                Degree: ${edu.degree || 'N/A'} at ${edu.school || 'N/A'} f${edu.startDate || 'N/A'}
                to ${edu.endDate || 'N/A'}
                `,
              )
              .join('\n\n')}

            Skills:
            ${input.skills?.join(', ')}
        `;

    const response = await this.gemini.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: userMessage,
      config: {
        systemInstruction: systemMessage,
      },
    });

    const content = response.candidates?.[0].content?.parts?.[0];
    if (!content)
      throw new InternalServerErrorException('Failed to generate AI response');
    return content;
  }
  async generateWorkExperience(input: GenerateWorkExperienceDto) {
    const { description } = input;

    const systemMessage = `
    You are a job resume generator AI. Your task is to generate a single work experience entry based on the user input.
    Your response must adhere to the following structure. You can omit fields if they can't be infered from the provided data,
    but don't add any new ones.

    Job title: <job_title> (only if provided)
    Company: <company> (only if provided)
    Start date: <start_date, format: YYYY-MM-DD> (only if provided)
    End date: <end_date, format: YYYY-MM-DD> (only if provided)
    Description: <an optimized description in bullet format, might be infered from the job title>
    `;

    const userMessage = `
    Please provide work experience entry from the description:
    ${description}
    `;

    const response = await this.gemini.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: userMessage,
      config: {
        systemInstruction: systemMessage,
      },
    });

    const text = response.candidates?.[0].content?.parts?.[0].text;

    if (!text)
      throw new InternalServerErrorException('Failed to generate AI response');

    const startDateString = text.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1];
    const endDateString = text.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1];

    return {
      position: text.match(/Job title: (.*)/)?.[1] || '',
      company: text.match(/Company: (.*)/)?.[1] || '',
      description: (text.match(/Description:([\s\S]*)/)?.[1] || '').trim(),
      startDate: startDateString ? new Date(startDateString) : undefined,
      endDate: endDateString ? new Date(endDateString) : undefined,
    } satisfies WorkExperienceDto;
  }
}
