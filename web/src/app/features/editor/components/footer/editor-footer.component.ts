import { Component, model, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFileUser, lucidePenLine } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { hlm } from '@spartan-ng/helm/utils';
import { ResumeService } from '../../../../core/services/resume/resume.service';
import { EditorStepData, EditorStepService } from '../../services/editor-step.service';

@Component({
  selector: 'app-editor-footer',
  imports: [HlmButton, RouterLink, NgIcon, HlmIcon],
  providers: [provideIcons({ lucidePenLine, lucideFileUser })],
  template: `
    <footer class="w-full border-t px-3 py-5">
      <div class="max-w-7xl mx-auto flex flex-wrap justify-between gap-3">
        <div class="flex items-center gap-3">
          <button
            hlmBtn
            variant="secondary"
            [disabled]="!previoudStep()"
            (click)="previoudStep() && setCurrentStep(previoudStep())"
          >
            Previous step
          </button>
          <button
            hlmBtn
            [disabled]="!nextStep()"
            (click)="nextStep() && setCurrentStep(nextStep())"
          >
            Next step
          </button>
        </div>
        <button
          hlmBtn
          variant="outline"
          size="icon"
          (click)="toggleSmResumePreview()"
          class="md:hidden"
          [title]="smResumePreview() ? 'Show input form' : 'Show resume preview'"
        >
          <ng-icon
            hlm
            [name]="smResumePreview() ? 'lucidePenLine' : 'lucideFileUser'"
            size="sm"
          ></ng-icon>
        </button>
        <div class="flex items-center gap-3">
          <a hlmBtn variant="secondary" routerLink="/resumes"> Close </a>
          <p class="{{ hlm('text-muted-foreground opacity-0', isSaving() && 'opacity-100') }}">
            Saving...
          </p>
        </div>
      </div>
    </footer>
  `,
})
export class EditorFooterComponent {
  readonly smResumePreview = model<boolean>();

  protected currentStep!: Signal<EditorStepData>;
  protected previoudStep!: Signal<EditorStepData>;
  protected nextStep!: Signal<EditorStepData>;
  protected readonly isSaving!: Signal<boolean>;

  constructor(
    private readonly stepService: EditorStepService,
    private readonly resumeService: ResumeService,
  ) {
    this.currentStep = this.stepService.current;
    this.previoudStep = this.stepService.previousStep;
    this.nextStep = this.stepService.nextStep;
    this.isSaving = this.resumeService.isSaving;
  }

  get hlm() {
    return hlm;
  }

  setCurrentStep(step: EditorStepData) {
    if (!step) return;
    this.stepService.setCurrentStep(step.key);
  }

  toggleSmResumePreview() {
    this.smResumePreview.update((v) => !v);
  }
}
