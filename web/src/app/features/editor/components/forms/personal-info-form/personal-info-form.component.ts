import { Component, DestroyRef, inject, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmError, HlmFormField } from '@spartan-ng/helm/form-field';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { ResumeService } from '../../../../../core/services/resume/resume.service';
import { buildPersonalInfoForm } from '../../../forms/personal-info.form';
import { ResumeData } from '../../../models';

@Component({
  selector: 'app-personal-info-form',
  imports: [ReactiveFormsModule, HlmFormField, HlmInput, HlmLabel, HlmError, HlmButton],
  templateUrl: './personal-info-form.component.html',
})
export class PersonalInfoFormComponent {
  readonly resumeData!: Signal<ResumeData>;

  private readonly fb = inject(FormBuilder);
  protected readonly form = buildPersonalInfoForm(this.fb);

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

  setResumeData(data: ResumeData) {
    this.resumeService.setResumeData(data);
  }

  patchForm(data: ResumeData) {
    this.form.patchValue(data, { emitEvent: false });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.form.get('photo')?.setValue(file);
      this.form.get('photo')?.updateValueAndValidity();
    }
  }

  removeFile(el: HTMLInputElement) {
    this.form.get('photo')?.setValue(null);
    this.form.get('photo')?.updateValueAndValidity();
    el.value = '';
  }
}
