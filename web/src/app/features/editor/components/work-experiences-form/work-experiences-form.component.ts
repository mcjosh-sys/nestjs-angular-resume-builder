import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, DestroyRef, inject, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { ResumeService } from '../../../../core/services/resume/resume.service';
import {
  buildWorkExperienceForm,
  buildWorkExperiencesForm,
  WorkExperienceFormArray,
} from '../../forms/work-experience.form';
import { ResumeData } from '../../models/resume.model';
import { WorkExperienceFormItemComponent } from './work-experience-form-item/work-experience-form-item.component';

@Component({
  selector: 'app-work-experiences-form',
  imports: [ReactiveFormsModule, WorkExperienceFormItemComponent, HlmButton, CdkDrag, CdkDropList],
  templateUrl: './work-experiences-form.component.html',
})
export class WorkExperiencesFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly resumeData!: Signal<ResumeData>;
  readonly form = buildWorkExperiencesForm(this.fb);

  constructor(
    private readonly resumeService: ResumeService,
    private readonly destroyRef: DestroyRef,
  ) {
    this.resumeData = this.resumeService.resumeData;
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((values) => {
      this.setResumeData({
        workExperiences: values.workExperiences?.filter((we) => we !== undefined) ?? [],
      });
    });

    this.resumeService.onFetchedResume.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.patchForm(this.resumeData());
    });
  }

  ngOnInit(): void {
    this.patchForm(this.resumeData());
  }

  get workExperienceFormArray() {
    return this.form.get('workExperiences') as WorkExperienceFormArray;
  }

  appendWorkExperienceForm() {
    const form = buildWorkExperienceForm(this.fb);
    this.workExperienceFormArray.push(form);
  }

  handleDrop(event: CdkDragDrop<any>) {
    // console.log(event);
    moveItemInArray(this.workExperienceFormArray.controls, event.previousIndex, event.currentIndex);
    const workExperiences = this.resumeData().workExperiences ?? [];

    if (workExperiences.length) {
      moveItemInArray(workExperiences, event.previousIndex, event.currentIndex);
      this.setResumeData({
        workExperiences,
      });
    }
  }

  patchForm(data: ResumeData) {
    this.workExperienceFormArray.clear();
    data.workExperiences?.forEach((we) => {
      const form = buildWorkExperienceForm(this.fb);
      form.patchValue(we, { emitEvent: false });
      this.workExperienceFormArray.push(form, { emitEvent: false });
    });
  }

  setResumeData(data: ResumeData) {
    this.resumeService.setResumeData(data);
  }

  handleRemove(index: number) {
    this.workExperienceFormArray.removeAt(index);
  }
}
