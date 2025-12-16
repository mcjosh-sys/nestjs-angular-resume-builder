import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { finalize, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ResumePDFService {
  private readonly http = inject(HttpClient);

  private getHtml(content: string, title: string, css: string = '') {
    return `
    <html >
      <head>
      <title>${title}</title>
        <base href="${window.location.origin}/" />
        <style>
        ${css}
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
    `;
  }

  download(el: HTMLElement, title: string, pending: (pending: boolean) => void = () => {}) {
    const css$ = this.http.get('styles.css', { responseType: 'text' });
    pending(true);
    const html$ = (html: string) =>
      this.http.post(`${environment.apiBaseUrl}/pdf/from-html`, { html }, { responseType: 'blob' });
    css$
      .pipe(
        switchMap((css) => {
          const html = this.getHtml(el.innerHTML, title, css);
          return html$(html);
        }),
        finalize(() => pending(false)),
      )
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          // const filename = `${title.replace(/\s+/g, '-').toLowerCase()}.pdf`;
          const filename = `${title}.pdf`;
          a.href = url;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('PDF generation failed:', err);
        },
      });
  }
}
