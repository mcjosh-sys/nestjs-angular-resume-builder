import { Component, computed, input, Signal } from '@angular/core';
import { ResumePreviewComponent } from '@shared/components/resume-preview/resume-preview.component';
import { hlm } from '@spartan-ng/helm/utils';
import { ClassValue } from 'clsx';
import { ResumeService } from '../../../../core/services/resume/resume.service';
import { ResumeData } from '../../models/resume.model';
import { BorderStyleButtonComponent } from '../border-style-button/border-style-button.component';
import { ColorPickerComponent } from '../color-picker/color-picker.component';

export const DEFAULT_RESUME_COLOR = '#000000';

@Component({
  selector: 'app-resume-preview-section',
  imports: [ResumePreviewComponent, ColorPickerComponent, BorderStyleButtonComponent],
  templateUrl: './resume-preview-section.component.html',
  host: {
    '[class]': 'className()',
  },
})
export class ResumePreviewSectionComponent {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  readonly className = computed(() =>
    hlm('group relative hidden md:w-1/2 md:flex w-full', this.userClass()),
  );

  readonly resumeData!: Signal<ResumeData>;
  readonly color = computed(() => this.resumeData()?.colorHex ?? DEFAULT_RESUME_COLOR);
  readonly borderStyle = computed(() => this.resumeData()?.borderStyle);

  constructor(private readonly resumeService: ResumeService) {
    this.resumeData = this.resumeService.resumeData;
  }

  setResumeData(data: ResumeData) {
    this.resumeService.setResumeData(data);
  }
}
