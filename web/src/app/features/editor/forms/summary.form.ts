import { FormBuilder, FormControl } from '@angular/forms';

export interface SummaryForm {
  summary: FormControl<string>;
}

export function buildSummaryForm(formBuilder: FormBuilder) {
  return formBuilder.group<SummaryForm>({
    summary: formBuilder.control('', { nonNullable: true }),
  });
}

export type SummaryFormGroup = ReturnType<typeof buildSummaryForm>;
export type SummaryValue = ReturnType<SummaryFormGroup['getRawValue']>;
