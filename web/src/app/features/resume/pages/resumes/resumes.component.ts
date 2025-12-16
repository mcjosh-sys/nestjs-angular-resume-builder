import { Component, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ResumeServerData } from '@features/editor/models';
import { ResumeItemComponent } from '@features/resume/components/resume-item/resume-item.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSquarePlus } from '@ng-icons/lucide';
import { UserSubscription } from '@shared/models';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { finalize, forkJoin, tap } from 'rxjs';
import { EventBusService } from 'src/app/core/services/refresh/event-bus.service';
import { ResumeService } from 'src/app/core/services/resume/resume.service';
import { SubscriptionService } from 'src/app/core/services/resume/subscription.service';
import { premiumModal } from 'src/app/core/utils/modal-helpers';
import { canCreateResumes as canCreateResume } from 'src/app/core/utils/resume/permissions';

export interface ResumeEvents {
  'resume:delete': { resumeId: string };
  'resume:download': { resumeId: string };
  'resume:pending': { action: 'delete' | 'download'; resumeId: string; pending: boolean };
  'resumes:refresh': undefined;
}

@Component({
  selector: 'app-resumes',
  imports: [HlmButton, HlmIcon, NgIcon, ResumeItemComponent],
  providers: [provideIcons({ lucideSquarePlus })],
  templateUrl: './resumes.component.html',
  styleUrl: './resumes.component.css',
})
export class ResumesComponent {
  protected readonly resumes = signal<ResumeServerData[]>([]);
  protected readonly subscription = signal<UserSubscription>({ level: 'free', subscription: null });
  private readonly premiumModal = premiumModal();
  protected readonly loading = signal(false);

  constructor(
    private readonly resumeService: ResumeService,
    private readonly subscriptionService: SubscriptionService,
    private readonly destroyRef: DestroyRef,
    private readonly eventBus: EventBusService<ResumeEvents>,
    private readonly router: Router,
  ) {
    this.eventBus
      .on('resumes:refresh')
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.getData());
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    const resumes$ = this.resumeService
      .getResumes$()
      .pipe(takeUntilDestroyed(this.destroyRef), tap(this.resumes.set));

    const subscription$ = this.subscriptionService
      .getSubscription()
      .pipe(takeUntilDestroyed(this.destroyRef), tap(this.subscription.set));

    this.loading.set(true);
    forkJoin([resumes$, subscription$])
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe();
  }

  handleCreate(event: PointerEvent) {
    event.preventDefault();
    if (!canCreateResume(this.subscription().level, this.resumes().length)) {
      return this.premiumModal.open();
    }
    this.router.navigateByUrl('/editor');
  }
}
