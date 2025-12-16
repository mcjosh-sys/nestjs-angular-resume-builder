import { Component, computed, input } from '@angular/core';
import { DEFAULT_RESUME_COLOR } from 'src/app/features/editor/components/resume-preview-section/resume-preview-section.component';
import { ResumeData } from 'src/app/features/editor/models/resume.model';

@Component({
  selector: 'app-summary-section',
  imports: [],
  templateUrl: './summary-section.component.html',
})
export class SummarySectionComponent {
  readonly resumeData = input<ResumeData>({});
  readonly summary = computed(() => this.resumeData().summary);
  readonly color = computed(() => this.resumeData().colorHex ?? DEFAULT_RESUME_COLOR);
}
