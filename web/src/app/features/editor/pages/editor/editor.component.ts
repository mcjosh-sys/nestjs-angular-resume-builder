import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, ElementRef, HostListener, signal, Signal, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { LoadingComponent } from '@shared/components/ui/loading/loading.component';
import { hlm } from '@spartan-ng/helm/utils';
import { provideSearchParams } from 'src/app/core/services/search-params/search-params.provider';
import { SearchParamsService } from 'src/app/core/services/search-params/search-params.service';
import { stringCodec } from 'src/app/core/utils/codecs';
import { ResumeService } from '../../../../core/services/resume/resume.service';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { EditorFooterComponent } from '../../components/footer/editor-footer.component';
import { EducationsFormComponent } from '../../components/forms/educations-form/educations-form.component';
import { GeneralInfoFormComponent } from '../../components/forms/general-info-form/general-info-form.component';
import { PersonalInfoFormComponent } from '../../components/forms/personal-info-form/personal-info-form.component';
import { SkillsFormComponent } from '../../components/forms/skills-form/skills-form.component';
import { SummaryFormComponent } from '../../components/forms/summary-form/summary-form.component';
import { ResumePreviewSectionComponent } from '../../components/resume-preview-section/resume-preview-section.component';
import { WorkExperiencesFormComponent } from '../../components/work-experiences-form/work-experiences-form.component';
import { ResumeData } from '../../models/resume.model';
import { EditorStep, EditorStepData, EditorStepService } from '../../services/editor-step.service';

export interface EditorQuery {
  step: EditorStep;
}

@Component({
  selector: 'app-editor',
  imports: [
    BreadcrumbsComponent,
    EditorFooterComponent,
    WorkExperiencesFormComponent,
    GeneralInfoFormComponent,
    PersonalInfoFormComponent,
    EducationsFormComponent,
    SkillsFormComponent,
    SummaryFormComponent,
    ResumePreviewSectionComponent,
    CdkScrollable,
    LoadingComponent,
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
  host: {
    class: 'flex grow flex-col',
  },
  providers: [
    ...provideSearchParams({
      step: stringCodec,
      resumeId: stringCodec,
    }),
  ],
})
export class EditorComponent {
  @ViewChild('formContainer', { static: true }) container!: ElementRef<HTMLDivElement>;

  protected readonly currentStep!: Signal<EditorStepData>;
  protected readonly resumeData!: Signal<ResumeData>;
  protected readonly isFetchingResume!: Signal<boolean>;

  protected readonly smResumePreview = signal<boolean>(false);

  readonly ignoreBeforeUnload = signal<boolean>(false);

  constructor(
    private readonly stepService: EditorStepService,
    private readonly resumeService: ResumeService,
    private readonly router: Router,
    private readonly params: SearchParamsService<{ step: EditorStep; resumeId: string }>,
  ) {
    this.currentStep = this.stepService.current;
    this.resumeData = this.resumeService.resumeData;
    this.isFetchingResume = this.resumeService.isFetchingResume;

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (event.url === '/sign-in') {
          this.ignoreBeforeUnload.set(true);
        } else {
          this.ignoreBeforeUnload.set(false);
        }
      }
    });
  }

  get hlm() {
    return hlm;
  }

  ngOnInit(): void {
    const step = this.params.get('step');
    if (step) this.stepService.setCurrentStep(step);
    const resumeId = this.params.get('resumeId');
    if (resumeId && resumeId !== this.resumeService.resumeId())
      this.resumeService.getResume$(resumeId).subscribe();
  }

  ngOnDestroy(): void {
    this.resumeService.reset();
  }

  hasUnsavedChanges() {
    return this.resumeService.hasUnsavedChanges();
  }

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent) {
    if (this.hasUnsavedChanges() && !this.ignoreBeforeUnload()) {
      event.preventDefault();
      (event as any).returnValue = '';
    }
  }
}
