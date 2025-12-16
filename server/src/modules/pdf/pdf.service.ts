import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  async generateFromHtml(html: string) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '0.6cm',
        right: '0.6cm',
        bottom: '0.6cm',
        left: '0.6cm',
      },
      printBackground: true,
    });

    await browser.close();
    return pdfBuffer;
  }
}
