import { Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { ResumeService } from '../../../../core/services/resume/resume.service';

@Component({
  selector: 'app-resume-save-failed',
  imports: [HlmButton],
  template: `
    <div
      style="display: flex; justify-content: space-between;align-items: center; gap: 1rem; width: 100%;"
    >
      <p>Could not save changes</p>
      <button hlmBtn variant="secondary" (click)="handleRetry()">Retry</button>
    </div>
  `,
})
export class ResumeSaveFailedComponent {
  constructor(private readonly resumeService: ResumeService) {}

  handleRetry() {
    this.resumeService.saveResume().subscribe();
  }
}
