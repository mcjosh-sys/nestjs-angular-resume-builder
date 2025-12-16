import { Component, computed, effect, input, signal } from '@angular/core';
import { PlatformService } from 'src/app/core/services/platform.service';
import { DEFAULT_RESUME_COLOR } from 'src/app/features/editor/components/resume-preview-section/resume-preview-section.component';
import { ResumeData } from 'src/app/features/editor/models/resume.model';
import { BorderStyles } from './../../../../../features/editor/components/border-style-button/border-style-button.component';

@Component({
  selector: 'app-personal-info-header',
  imports: [],
  templateUrl: './personal-info-header.component.html',
  host: {
    class: 'flex items-center gap-6',
  },
})
export class PersonalInfoHeaderComponent {
  readonly resumeData = input<ResumeData>({});
  readonly photoSrc = signal<string>('');
  readonly color = computed(() => this.resumeData()?.colorHex ?? DEFAULT_RESUME_COLOR);
  readonly borderStyle = computed(() => this.resumeData()?.borderStyle);
  readonly isPhotoFile = computed(() => this.resumeData().photo instanceof File);

  urlTeardown = () => {};

  constructor(private readonly platform: PlatformService) {
    if (!this.platform.isBrowser()) return;

    effect(() => {
      const { photo } = this.resumeData();
      if (!photo) {
        this.photoSrc.set('');
        return;
      }

      if (photo instanceof File) {
        this.urlTeardown();
        const objectUrl = URL.createObjectURL(photo);
        this.photoSrc.set(objectUrl);
        this.urlTeardown = () => URL.revokeObjectURL(objectUrl);
      } else {
        this.urlTeardown();
        this.urlTeardown = () => {};
        this.photoSrc.set(photo);
      }
    });
  }

  get borderStyles() {
    return BorderStyles;
  }

  ngOnDestroy(): void {
    this.urlTeardown();
  }

  renderData(...data: (string | undefined | null)[]) {
    return data.filter(Boolean).join(' • ');
  }
}
