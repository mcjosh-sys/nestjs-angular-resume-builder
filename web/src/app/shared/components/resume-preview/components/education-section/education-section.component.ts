import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { DEFAULT_RESUME_COLOR } from 'src/app/features/editor/components/resume-preview-section/resume-preview-section.component';
import { ResumeData } from 'src/app/features/editor/models/resume.model';

@Component({
  selector: 'app-education-section',
  imports: [DatePipe],
  templateUrl: './education-section.component.html',
})
export class EducationSectionComponent {
  readonly resumeData = input<ResumeData>({});

  readonly nonEmptyEducations = computed(() => {
    const { educations } = this.resumeData();
    return educations?.filter((ed) => Object.values(ed).filter(Boolean).length > 0);
  });

  readonly color = computed(() => this.resumeData()?.colorHex ?? DEFAULT_RESUME_COLOR);
}
