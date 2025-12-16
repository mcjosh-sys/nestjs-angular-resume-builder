import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { fileStartsWith, maxFileSize } from '../validators/file.validator';

export type PersonalInfoForm = {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  jobTitle: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  country: FormControl<string>;
  city: FormControl<string>;
  photo: FormControl<File | null | string>;
};

export function buildPersonalInfoForm(formBuilder: FormBuilder) {
  return formBuilder.group<PersonalInfoForm>({
    firstName: formBuilder.control('', { nonNullable: true }),
    lastName: formBuilder.control('', { nonNullable: true }),
    jobTitle: formBuilder.control('', { nonNullable: true }),
    email: formBuilder.control('', { nonNullable: true, validators: [Validators.email] }),
    phone: formBuilder.control('', { nonNullable: true }),
    country: formBuilder.control('', { nonNullable: true }),
    city: formBuilder.control('', { nonNullable: true }),
    photo: formBuilder.control(null, {
      validators: [fileStartsWith('image/'), maxFileSize(1024 * 1024 * 4)],
    }),
  });
}

export type PeronalInfoFormGroup = ReturnType<typeof buildPersonalInfoForm>;
export type PersonalInfoValue = ReturnType<PeronalInfoFormGroup['getRawValue']>;
