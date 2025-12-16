import { Component, output, Signal, signal } from '@angular/core';
import { ResumeData } from '@features/editor/models';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoaderCircle, lucideWandSparkles } from '@ng-icons/lucide';
import { LoadingButtonComponent } from '@shared/components/ui/buttons/loading-button.component';
import { UserSubscription } from '@shared/models';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { finalize } from 'rxjs';
import { ResumeAiService } from 'src/app/core/services/resume/resume-ai.service';
import { ResumeService } from 'src/app/core/services/resume/resume.service';
import { SubscriptionService } from 'src/app/core/services/resume/subscription.service';
import { premiumModal } from 'src/app/core/utils/modal-helpers';
import { canUseAIFeatures } from 'src/app/core/utils/resume/permissions';

@Component({
  selector: 'app-generate-summary-button',
  imports: [LoadingButtonComponent, NgIcon, HlmIcon],
  providers: [provideIcons({ lucideWandSparkles, lucideLoaderCircle })],
  template: `
    <app-loading-button
      variant="outline"
      type="button"
      [loading]="loading() || pending()"
      (onClick)="handleClick()"
    >
      <ng-icon
        hlm
        [name]="loading() ? 'lucideLoaderCircle' : 'lucideWandSparkles'"
        size="16"
      ></ng-icon>
      Generate (AI)
    </app-loading-button>
  `,
})
export class GenerateSummaryButtonComponent {
  readonly onSummaryGenerated = output<void>();

  protected readonly resumeData!: Signal<ResumeData>;
  protected readonly loading = signal<boolean>(false);
  protected readonly pending = signal<boolean>(false);
  protected readonly subscription = signal<UserSubscription>({ level: 'free', subscription: null });

  private readonly premiumModal = premiumModal();

  constructor(
    private readonly resumeService: ResumeService,
    private readonly resumeAiService: ResumeAiService,
    private readonly subscriptionService: SubscriptionService,
  ) {
    this.resumeData = this.resumeService.resumeData;
    this.loading.set(true);
    this.subscriptionService
      .getSubscription()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(this.subscription.set);
  }

  setResumeData(resumeData: ResumeData) {
    this.resumeService.setResumeData(resumeData);
  }

  handleClick() {
    if (!canUseAIFeatures(this.subscription().level)) return this.premiumModal.open();

    this.pending.set(true);
    this.resumeAiService
      .generateSummary(this.resumeData())
      .pipe(finalize(() => this.pending.set(false)))
      .subscribe((summary) => {
        if (!summary) return;
        this.setResumeData({ summary });
        this.onSummaryGenerated.emit();
      });
  }
}
