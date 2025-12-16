import { IsString } from 'class-validator';

export class CreatePdfDto {
  @IsString()
  html: string;
}
