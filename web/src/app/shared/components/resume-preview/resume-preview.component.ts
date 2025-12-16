import { Component, ElementRef, input, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ResumeEvents } from '@features/resume/pages/resumes/resumes.component';
import { DimensionsDirective } from '@shared/directives/dimensions.directive';
import { hlm } from '@spartan-ng/helm/utils';
import { ClassValue } from 'clsx';
import { filter } from 'rxjs';
import { AppEvent, EventBusService } from 'src/app/core/services/refresh/event-bus.service';
import { ResumePDFService } from 'src/app/core/services/resume/resume-pdf.service';
import { ResumeData } from 'src/app/features/editor/models/resume.model';
import { EducationSectionComponent } from './components/education-section/education-section.component';
import { PersonalInfoHeaderComponent } from './components/personal-info-header/personal-info-header.component';
import { SkillsSectionComponent } from './components/skills-section/skills-section.component';
import { SummarySectionComponent } from './components/summary-section/summary-section.component';
import { WorkExperienceSectionComponent } from './components/work-experience-section/work-experience-section.component';

export type ResumePrintEvent = AppEvent<'print:resume', { resumeId: string }>;

@Component({
  selector: 'app-resume-preview',
  imports: [
    DimensionsDirective,
    PersonalInfoHeaderComponent,
    SummarySectionComponent,
    WorkExperienceSectionComponent,
    EducationSectionComponent,
    SkillsSectionComponent,
  ],
  templateUrl: './resume-preview.component.html',
  host: {
    class: 'w-full',
  },
})
export class ResumePreviewComponent {
  @ViewChild('resumeContentPreview', { static: true }) resumeContainerRef!: ElementRef<HTMLElement>;

  readonly className = input<ClassValue>('');
  readonly resumeData = input<ResumeData>({});

  constructor(
    private readonly eventBus: EventBusService<ResumeEvents>,
    private readonly pdf: ResumePDFService,
  ) {
    this.eventBus
      .on('resume:download')
      .pipe(
        takeUntilDestroyed(),
        filter(({ resumeId }) => resumeId === this.resumeData().id),
      )
      .subscribe(() => {
        this.downloadResume();
      });
  }

  get hlm() {
    return hlm;
  }

  downloadResume() {
    if (!this.resumeContainerRef) return;
    const { firstName, lastName, title } = this.resumeData();
    const name = `${firstName || ''} ${lastName || ''}`.trim();
    const resumeTitle = `${name ? name + ' - ' : ''} ${title}`.trim() || 'Resume';
    const pending = (value: boolean) => {
      this.eventBus.emit('resume:pending', {
        action: 'download',
        resumeId: this.resumeData().id!,
        pending: value,
      });
    };
    this.pdf.download(this.resumeContainerRef.nativeElement, resumeTitle, pending);
  }
}
