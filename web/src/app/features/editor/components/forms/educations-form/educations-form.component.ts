import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, DestroyRef, inject, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { ResumeService } from '../../../../../core/services/resume/resume.service';
import {
  buildEducationForm,
  buildEducationForms,
  EducationFormArray,
} from '../../../forms/education.form';
import { ResumeData } from '../../../models';
import { EducationFormItemComponent } from './education-form-item/education-form-item.component';

@Component({
  selector: 'app-educations-form',
  imports: [ReactiveFormsModule, EducationFormItemComponent, HlmButton, CdkDrag, CdkDropList],
  templateUrl: './educations-form.component.html',
})
export class EducationsFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly form = buildEducationForms(this.fb);
  readonly resumeData!: Signal<ResumeData>;

  constructor(
    private readonly resumeService: ResumeService,
    private readonly destroyRef: DestroyRef,
  ) {
    this.resumeData = this.resumeService.resumeData;
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((values) => {
      this.setResumeData({
        educations: values.educations?.filter((ed) => ed !== undefined) ?? [],
      });
    });

    this.resumeService.onFetchedResume.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.patchForm(this.resumeData());
    });
  }

  ngOnInit(): void {
    this.patchForm(this.resumeData());
  }

  get educationFormArray() {
    return this.form.get('educations') as EducationFormArray;
  }

  appendEducationForm() {
    const form = buildEducationForm(this.fb);
    this.educationFormArray.push(form);
  }

  handleRemove(index: number) {
    this.educationFormArray.removeAt(index);
  }

  handleDrop(event: CdkDragDrop<any>) {
    // console.log(event);
    moveItemInArray(this.educationFormArray.controls, event.previousIndex, event.currentIndex);
    const educations = this.resumeData().educations ?? [];

    if (educations.length) {
      moveItemInArray(educations, event.previousIndex, event.currentIndex);
      this.setResumeData({
        educations: educations,
      });
    }
  }

  patchForm(data: ResumeData) {
    this.educationFormArray.clear();
    data.educations?.forEach((ed) => {
      const form = buildEducationForm(this.fb);
      form.patchValue(ed, { emitEvent: false });
      this.educationFormArray.push(form, { emitEvent: false });
    });
  }

  setResumeData(data: ResumeData) {
    this.resumeService.setResumeData(data);
  }
}
