import { IsString, MinLength } from 'class-validator';

export class GenerateWorkExperienceDto {
  @IsString()
  @MinLength(20, { message: 'Description must be at least 20 characters long' })
  description: string;
}
