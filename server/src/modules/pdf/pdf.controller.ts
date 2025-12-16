import { Public } from '@/common/decorators/public.decorator';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { type Response } from 'express';
import { PdfService } from './pdf.service';

@Public()
@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('from-html')
  async fromHtml(@Body('html') html: string, @Res() res: Response) {
    const pdfBuffer = await this.pdfService.generateFromHtml(html);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=resume.pdf',
      'Access-Control-Allow-Origin': '*', // ⚠️ Only for testing — use proper CORS config
    });
    res.end(pdfBuffer);
  }
}
