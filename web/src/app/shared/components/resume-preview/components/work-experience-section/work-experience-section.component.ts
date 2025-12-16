import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { DEFAULT_RESUME_COLOR } from 'src/app/features/editor/components/resume-preview-section/resume-preview-section.component';
import { ResumeData } from 'src/app/features/editor/models/resume.model';

@Component({
  selector: 'app-work-experience-section',
  imports: [DatePipe],
  templateUrl: './work-experience-section.component.html',
})
export class WorkExperienceSectionComponent {
  readonly resumeData = input<ResumeData>({});
  readonly nonEmptyWorkExperiences = computed(() => {
    const { workExperiences } = this.resumeData();
    return workExperiences?.filter((exp) => Object.values(exp).filter(Boolean).length > 0);
  });
  readonly color = computed(() => this.resumeData()?.colorHex ?? DEFAULT_RESUME_COLOR);
}
