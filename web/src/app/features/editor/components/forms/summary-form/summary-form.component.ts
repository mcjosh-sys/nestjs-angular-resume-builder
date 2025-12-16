import { Component, DestroyRef, inject, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HlmFormField, HlmHint } from '@spartan-ng/helm/form-field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { ResumeService } from '../../../../../core/services/resume/resume.service';
import { buildSummaryForm } from '../../../forms/summary.form';
import { ResumeData } from '../../../models';
import { GenerateSummaryButtonComponent } from '../buttons/generate-summary-button.component';

@Component({
  selector: 'app-summary-form',
  imports: [
    HlmInputImports,
    HlmFormField,
    ReactiveFormsModule,
    HlmHint,
    GenerateSummaryButtonComponent,
  ],
  templateUrl: './summary-form.component.html',
})
export class SummaryFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly form = buildSummaryForm(this.fb);
  readonly resumeData!: Signal<ResumeData>;

  constructor(
    private readonly resumeService: ResumeService,
    private readonly destroyRef: DestroyRef,
  ) {
    this.resumeData = this.resumeService.resumeData;
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((values) => {
      this.setResumeData({
        summary: values.summary ?? '',
      });
    });

    this.resumeService.onFetchedResume.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.form.patchValue(this.resumeData(), { emitEvent: false });
    });
  }

  ngOnInit(): void {
    this.patchForm(this.resumeData());
  }

  patchForm(data: ResumeData, emitEvent: boolean = false) {
    this.form.patchValue(data, { emitEvent });
  }

  onSummaryGenerated() {
    this.patchForm(this.resumeData(), true);
  }

  setResumeData(data: ResumeData) {
    this.resumeService.setResumeData(data);
  }
}
