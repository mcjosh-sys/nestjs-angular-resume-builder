import { FormBuilder, FormControl } from '@angular/forms';

export type GeneralInfoForm = {
  title: FormControl<string>;
  description: FormControl<string>;
};

export function buildGeneralInfoForm(formBuilder: FormBuilder) {
  return formBuilder.group<GeneralInfoForm>({
    title: formBuilder.control('', { nonNullable: true }),
    description: formBuilder.control('', { nonNullable: true }),
  });
}

export type GeneralInfoFormGroup = ReturnType<typeof buildGeneralInfoForm>;
export type GeneralInfoValue = ReturnType<GeneralInfoFormGroup['getRawValue']>;
