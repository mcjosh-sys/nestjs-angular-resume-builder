import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { Router } from '@angular/router';
import { ResumeServerData } from '@features/editor/models';
import { ResumePreviewComponent } from '@shared/components/resume-preview/resume-preview.component';
import { ResumeService } from 'src/app/core/services/resume/resume.service';
import { ResumeItemMenuComponent } from '../resume-item-menu/resume-item-menu.component';

@Component({
  selector: 'app-resume-item',
  imports: [DatePipe, ResumePreviewComponent, ResumeItemMenuComponent],
  templateUrl: './resume-item.component.html',
})
export class ResumeItemComponent {
  public readonly resume = input.required<ResumeServerData>();

  protected readonly wasUpdated = computed(
    () => this.resume().createdAt !== this.resume().updatedAt,
  );

  constructor(
    private readonly resumeService: ResumeService,
    private readonly router: Router,
  ) {}

  loadResume(e: PointerEvent) {
    e.preventDefault();
    this.resumeService.loadResume(this.resume());
    this.router.navigate(['/editor'], { queryParams: { resumeId: this.resume().id } });
  }
}
