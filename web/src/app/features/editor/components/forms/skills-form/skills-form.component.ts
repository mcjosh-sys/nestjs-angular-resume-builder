import { Component, DestroyRef, inject, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HlmFormField, HlmHint } from '@spartan-ng/helm/form-field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { ResumeService } from '../../../../../core/services/resume/resume.service';
import { buildSkillsForm } from '../../../forms/skills.form';
import { ResumeData } from '../../../models';

@Component({
  selector: 'app-skills-form',
  imports: [ReactiveFormsModule, HlmFormField, HlmInputImports, HlmHint],
  templateUrl: './skills-form.component.html',
})
export class SkillsFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly form = buildSkillsForm(this.fb);
  readonly resumeData!: Signal<ResumeData>;

  constructor(
    private readonly resumeService: ResumeService,
    private readonly destroyRef: DestroyRef,
  ) {
    this.resumeData = this.resumeService.resumeData;
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      let skills = value.skills;
      if (!Array.isArray(skills) && typeof skills === 'string') {
        skills = (skills as string).split(',');
        this.form.get('skills')?.setValue(skills, { emitEvent: false });
      }
      this.setResumeData({
        skills:
          skills
            ?.filter((skill) => skill !== undefined)
            .map((skill) => skill.trim())
            .filter((skill) => skill !== '') ?? [],
      });
    });

    this.resumeService.onFetchedResume.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.form.patchValue(this.resumeData(), { emitEvent: false });
    });
  }

  ngOnInit(): void {
    this.patchForm(this.resumeData());
  }

  patchForm(data: ResumeData) {
    this.form.patchValue(data, { emitEvent: false });
  }

  setResumeData(data: ResumeData) {
    this.resumeService.setResumeData(data);
  }
}
