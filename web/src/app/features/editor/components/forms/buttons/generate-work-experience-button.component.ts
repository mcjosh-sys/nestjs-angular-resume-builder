import { Component, output, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WorkExperienceValue } from '@features/editor/forms/work-experience.form';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoaderCircle, lucideWandSparkles } from '@ng-icons/lucide';
import { LoadingButtonComponent } from '@shared/components/ui/buttons/loading-button.component';
import { UserSubscription } from '@shared/models';
import { BrnDialog, BrnDialogImports } from '@spartan-ng/brain/dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmError, HlmFormField } from '@spartan-ng/helm/form-field';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { finalize } from 'rxjs';
import { ResumeAiService } from 'src/app/core/services/resume/resume-ai.service';
import { SubscriptionService } from 'src/app/core/services/resume/subscription.service';
import { premiumModal } from 'src/app/core/utils/modal-helpers';
import { canUseAIFeatures } from 'src/app/core/utils/resume/permissions';

interface Form {
  aiDescription: FormControl<string>;
}

@Component({
  selector: 'app-generate-work-experience-button',
  imports: [
    BrnDialogImports,
    HlmDialogImports,
    NgIcon,
    HlmIcon,
    HlmButton,
    HlmInput,
    HlmFormField,
    HlmLabel,
    ReactiveFormsModule,
    HlmError,
    LoadingButtonComponent,
  ],
  providers: [[provideIcons({ lucideWandSparkles, lucideLoaderCircle })]],
  template: `
    <button hlmBtn variant="outline" [disabled]="loading()" (click)="handleClick()">
      <ng-icon
        hlm
        [name]="loading() ? 'lucideLoaderCircle' : 'lucideWandSparkles'"
        size="16"
      ></ng-icon>
      Smart fill (AI)
    </button>
    <hlm-dialog [state]="dialogState()" (stateChanged)="dialogState.set($event)" #dialogRef>
      <hlm-dialog-content *brnDialogContent="let ctx">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>Generate work experience</h3>
          <p hlmDialogDescription>
            Describe this work experience and the AI will generate an optimized entry for you.
          </p>
        </hlm-dialog-header>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-3">
          <hlm-form-field>
            <label hlmLabel for="aiDescription">Description</label>
            <textarea
              hlmInput
              [formControl]="descriptionControl"
              id="aiDescription"
              style="height: 80px"
              placeholder="E.g. from nov 2019 to dec 2020. I worked at google as a software engineer, task were: ..."
              autofocus
            ></textarea>
            <hlm-error>
              @if (descriptionControl.errors?.['required']) {
                Required
              }
              @if (descriptionControl.errors?.['minlength']) {
                Must be at least 20 characters
              }
            </hlm-error>
          </hlm-form-field>
          <app-loading-button
            type="submit"
            [disabled]="descriptionControl.invalid"
            [loading]="pending()"
          >
            Generate
          </app-loading-button>
        </form>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class GenerateWorkExperienceButtonComponent {
  public readonly dialogRef = viewChild(BrnDialog);
  readonly onWorkExperienceGenerated = output<Partial<WorkExperienceValue>>();

  protected readonly loading = signal<boolean>(false);
  protected readonly pending = signal<boolean>(false);
  protected readonly dialogState = signal<'open' | 'closed'>('closed');
  protected readonly subscription = signal<UserSubscription>({ level: 'free', subscription: null });

  protected readonly form = new FormGroup<Form>({
    aiDescription: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20)],
    }),
  });

  protected readonly descriptionControl = this.form.controls.aiDescription;

  private readonly premiumModal = premiumModal();

  constructor(
    private readonly resumeAiService: ResumeAiService,
    private readonly subscriptionService: SubscriptionService,
  ) {
    this.loading.set(true);
    this.subscriptionService
      .getSubscription()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(this.subscription.set);
  }

  handleClick() {
    if (!canUseAIFeatures(this.subscription().level)) return this.premiumModal.open();
    this.dialogState.set('open');
  }

  onSubmit() {
    if (this.form.valid) {
      this.pending.set(true);
      const value = this.form.getRawValue();
      this.resumeAiService
        .generateWorkExperience(value.aiDescription)
        .pipe(finalize(() => this.pending.set(false)))
        .subscribe((workExperience) => {
          this.onWorkExperienceGenerated.emit(workExperience);
          this.dialogState.set('closed');
          this.dialogRef()?.close({});
        });
    }
  }
}
