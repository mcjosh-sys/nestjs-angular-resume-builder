import { Component, computed, input } from '@angular/core';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { BorderStyles } from 'src/app/features/editor/components/border-style-button/border-style-button.component';
import { DEFAULT_RESUME_COLOR } from 'src/app/features/editor/components/resume-preview-section/resume-preview-section.component';
import { ResumeData } from 'src/app/features/editor/models/resume.model';

@Component({
  selector: 'app-skills-section',
  imports: [HlmBadgeImports],
  templateUrl: './skills-section.component.html',
})
export class SkillsSectionComponent {
  readonly resumeData = input<ResumeData>({});
  readonly skills = computed(() => this.resumeData().skills ?? []);
  readonly color = computed(() => this.resumeData().colorHex ?? DEFAULT_RESUME_COLOR);
  readonly borderStyle = computed(() => this.resumeData()?.borderStyle);

  get borderStyles() {
    return BorderStyles;
  }
}
