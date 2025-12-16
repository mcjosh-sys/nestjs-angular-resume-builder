import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

export interface EducationForm {
  degree: FormControl<string>;
  school: FormControl<string>;
  startDate: FormControl<Date>;
  endDate: FormControl<Date>;
}

export interface EducationForms {
  educations: FormArray<FormGroup<EducationForm>>;
}

export function buildEducationForm(formBuilder: FormBuilder) {
  return formBuilder.group<EducationForm>({
    degree: formBuilder.control('', { nonNullable: true }),
    school: formBuilder.control('', { nonNullable: true }),
    startDate: formBuilder.control<any>(null, { nonNullable: true }),
    endDate: formBuilder.control<any>(null, { nonNullable: true }),
  });
}

export function buildEducationForms(formBuilder: FormBuilder) {
  return formBuilder.group<EducationForms>({
    educations: formBuilder.array<FormGroup<EducationForm>>([]),
  });
}

export type EducationFormGroup = FormGroup<EducationForm>;
export type EducationFormsFormGroup = FormGroup<EducationForms>;
export type EducationFormArray = EducationFormsFormGroup['controls']['educations'];
export type EducationValue = ReturnType<EducationFormGroup['getRawValue']>;
export type EducationValues = ReturnType<EducationFormsFormGroup['getRawValue']>;
