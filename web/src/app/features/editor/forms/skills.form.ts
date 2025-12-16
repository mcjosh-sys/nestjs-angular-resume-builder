import { FormBuilder, FormControl } from '@angular/forms';

export interface SkillsForm {
  skills: FormControl<string[]>;
}

export function buildSkillsForm(formBuilder: FormBuilder) {
  const form = formBuilder.group<SkillsForm>({
    skills: formBuilder.control([], { nonNullable: true }),
  });

  return form;
}

export type SkillsFormGroup = ReturnType<typeof buildSkillsForm>;
export type SkillsValue = ReturnType<SkillsFormGroup['getRawValue']>;
