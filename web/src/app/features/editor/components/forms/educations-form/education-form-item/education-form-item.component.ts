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
import { DateTime } from 'luxon';
import { EducationFormGroup } from 'src/app/features/editor/forms/education.form';

@Component({
  selector: 'app-education-form-item',
  imports: [
    ReactiveFormsModule,
    NgIcon,
    HlmIcon,
    HlmFormField,
    HlmLabel,
    HlmButton,
    HlmDatePickerImports,
    HlmInputImports,
    CdkDragPlaceholder,
    CdkDragHandle,
  ],
  templateUrl: './education-form-item.component.html',
  providers: [provideIcons({ lucideGripHorizontal })],
})
export class EducationFormItemComponent {
  form = input<EducationFormGroup>();
  index = input<number>();
  remove = output<number>();

  public formatDate = (date: Date) => DateTime.fromJSDate(date).toFormat('MMMM, yyyy');
}
