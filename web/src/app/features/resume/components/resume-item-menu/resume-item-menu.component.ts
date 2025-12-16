import { Component, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ResumeEvents } from '@features/resume/pages/resumes/resumes.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideDownload,
  lucideEllipsisVertical,
  lucideLoaderCircle,
  lucideTrash2,
} from '@ng-icons/lucide';
import { LoadingButtonComponent } from '@shared/components/ui/buttons/loading-button.component';
import { BrnDialogImports, BrnDialogState } from '@spartan-ng/brain/dialog';
import { BrnMenuTrigger } from '@spartan-ng/brain/menu';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmMenuImports } from '@spartan-ng/helm/menu';
import { filter, finalize } from 'rxjs';
import { EventBusService } from 'src/app/core/services/refresh/event-bus.service';
import { ResumeService } from 'src/app/core/services/resume/resume.service';

const pendingActions = {
  delete: 'deleting',
  download: 'downloading',
};

@Component({
  selector: 'app-resume-item-menu',
  imports: [
    HlmButton,
    HlmMenuImports,
    NgIcon,
    HlmIcon,
    BrnMenuTrigger,
    BrnDialogImports,
    HlmDialogImports,
    LoadingButtonComponent,
  ],
  providers: [
    provideIcons({ lucideEllipsisVertical, lucideTrash2, lucideDownload, lucideLoaderCircle }),
  ],
  templateUrl: './resume-item-menu.component.html',
})
export class ResumeItemMenuComponent {
  public readonly resumeId = input.required<string>();

  protected readonly showConfirmDialog = signal<BrnDialogState>('closed');

  protected readonly pending = signal<{ deleting: boolean; downloading: boolean }>({
    deleting: false,
    downloading: false,
  });

  constructor(
    private readonly resumeService: ResumeService,
    private readonly eventBus: EventBusService<ResumeEvents>,
  ) {
    this.eventBus
      .on('resume:pending')
      .pipe(
        takeUntilDestroyed(),
        filter(({ resumeId }) => resumeId === this.resumeId()),
      )
      .subscribe(({ action, pending }) => {
        this.pending.update((state) => ({ ...state, [pendingActions[action]]: pending }));
      });
  }

  handleDownload() {
    this.eventBus.emit('resume:download', { resumeId: this.resumeId()! });
  }

  handleDelete() {
    this.pending.update((state) => ({ ...state, deleting: true }));
    this.resumeService
      .deleteResume$(this.resumeId())
      .pipe(finalize(() => this.pending.update((state) => ({ ...state, deleting: false }))))
      .subscribe(() => {
        this.eventBus.emit('resumes:refresh');
        this.showConfirmDialog.set('closed');
      });
  }
}
