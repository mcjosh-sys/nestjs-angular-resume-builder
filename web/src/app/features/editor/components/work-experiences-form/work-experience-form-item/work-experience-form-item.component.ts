import { CdkDragHandle, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { Component, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGripHorizontal } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmFormField } from '@spartan-ng/helm/form-field';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { hlm } from '@spartan-ng/helm/utils';
import { DateTime } from 'luxon';
import { WorkExperienceFormGroup, WorkExperienceValue } from '../../../forms/work-experience.form';
import { GenerateWorkExperienceButtonComponent } from '../../forms/buttons/generate-work-experience-button.component';

@Component({
  selector: 'app-work-experience-form-item',
  imports: [
    ReactiveFormsModule,
    NgIcon,
    HlmIcon,
    HlmFormField,
    HlmInputImports,
    HlmLabel,
    HlmDatePickerImports,
    HlmButton,
    CdkDragPlaceholder,
    CdkDragHandle,
    GenerateWorkExperienceButtonComponent,
  ],
  templateUrl: './work-experience-form-item.component.html',
  providers: [provideIcons({ lucideGripHorizontal })],
})
export class WorkExperienceFormItemComponent {
  form = input<WorkExperienceFormGroup>();
  index = input<number>();
  remove = output<number>();

  formatDate = (date: Date) => DateTime.fromJSDate(date).toFormat('MMMM, yyyy');

  constructor() {}

  get hlm() {
    return hlm;
  }

  patchForm(value: Partial<WorkExperienceValue>) {
    this.form()?.patchValue(value);
  }
}
