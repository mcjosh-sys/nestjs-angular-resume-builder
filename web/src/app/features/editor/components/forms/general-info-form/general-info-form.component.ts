import { Component, DestroyRef, inject, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HlmFormField, HlmHint } from '@spartan-ng/helm/form-field';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { ResumeService } from '../../../../../core/services/resume/resume.service';
import { buildGeneralInfoForm } from '../../../forms/general-info.form';
import { ResumeData } from '../../../models';

@Component({
  selector: 'app-general-info-form',
  imports: [ReactiveFormsModule, HlmFormField, HlmInput, HlmLabel, HlmHint],
  templateUrl: './general-info-form.component.html',
})
export class GeneralInfoFormComponent {
  readonly resumeData!: Signal<ResumeData>;

  private readonly formBuilder = inject(FormBuilder);
  protected readonly form = buildGeneralInfoForm(this.formBuilder);

  constructor(
    private readonly resumeService: ResumeService,
    private readonly destroyRef: DestroyRef,
  ) {
    this.resumeData = this.resumeService.resumeData;
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(this.setResumeData.bind(this));

    this.resumeService.onFetchedResume.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.patchForm(this.resumeData());
    });
  }

  ngOnInit(): void {
    this.patchForm(this.resumeData());
  }

  patchForm(data: ResumeData) {
    this.form.patchValue(data, { emitEvent: false });
  }

  setResumeData(data: ResumeData) {
    this.resumeService.setResumeData(data);
  }
}
