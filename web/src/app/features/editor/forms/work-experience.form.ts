import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

export interface WorkExperienceForm {
  position: FormControl<string>;
  company: FormControl<string>;
  startDate: FormControl<Date>;
  endDate: FormControl<Date>;
  description: FormControl<string>;
  city: FormControl<string>;
  country: FormControl<string>;
}

export function buildWorkExperienceForm(formBuilder: FormBuilder) {
  return formBuilder.group<WorkExperienceForm>({
    position: formBuilder.control('', { nonNullable: true }),
    company: formBuilder.control('', { nonNullable: true }),
    startDate: formBuilder.control<any>(null, { nonNullable: true }),
    endDate: formBuilder.control<any>(null, { nonNullable: true }),
    description: formBuilder.control('', { nonNullable: true }),
    city: formBuilder.control('', { nonNullable: true }),
    country: formBuilder.control('', { nonNullable: true }),
  });
}

export function buildWorkExperiencesForm(formBuilder: FormBuilder) {
  return formBuilder.group({
    workExperiences: formBuilder.array<FormGroup<WorkExperienceForm>>([
      // buildWorkExperienceForm(formBuilder),
    ]),
  });
}

export type WorkExperienceFormGroup = FormGroup<WorkExperienceForm>;
export type WorkExperiencesFormGroup = ReturnType<typeof buildWorkExperiencesForm>;
export type WorkExperienceFormArray = WorkExperiencesFormGroup['controls']['workExperiences'];
export type WorkExperienceValue = ReturnType<WorkExperienceFormGroup['getRawValue']>;
export type WorkExperiencesValue = ReturnType<WorkExperiencesFormGroup['getRawValue']>;
