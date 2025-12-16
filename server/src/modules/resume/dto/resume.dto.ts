import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsHexColor,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EducationDto } from './education.dto';
import { WorkExperienceDto } from './work-experience.dto';

export class ResumeDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkExperienceDto)
  workExperiences?: WorkExperienceDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationDto)
  educations?: EducationDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  photo?: string | null;

  @IsOptional()
  @IsHexColor()
  colorHex?: string;

  @IsOptional()
  @IsString()
  borderStyle?: string;
}
