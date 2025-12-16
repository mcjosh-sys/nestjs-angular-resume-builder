import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoaderCircle, lucidePalette } from '@ng-icons/lucide';
import { UserSubscription } from '@shared/models';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { finalize } from 'rxjs';
import { SubscriptionService } from 'src/app/core/services/resume/subscription.service';
import { colorToHex } from 'src/app/core/utils/color-helpers';
import { premiumModal } from 'src/app/core/utils/modal-helpers';
import { canUseCustomizationFeatures } from 'src/app/core/utils/resume/permissions';

@Component({
  selector: 'app-color-picker',
  imports: [NgIcon, HlmIcon, HlmButton, FormsModule],
  providers: [provideIcons({ lucidePalette, lucideLoaderCircle })],
  template: `
    <button
      hlmBtn
      [disabled]="loading()"
      size="icon"
      title="Change resume color"
      [class.invisible]="loading()"
      (click)="onChangeColor(picker)"
    >
      <ng-icon hlm [name]="loading() ? 'lucideLoaderCircle' : 'lucidePalette'" size="sm"></ng-icon>
    </button>
    <input
      type="color"
      [ngModel]="color()"
      (ngModelChange)="handleColorChange($event)"
      class="hidden"
      #picker
    />
  `,
  // Removed invalid host binding for ngSkipHydration
})
export class ColorPickerComponent {
  readonly color = input<string>('#effaa4');
  readonly onChange = output<string>();

  protected readonly loading = signal(false);
  protected readonly subscription = signal<UserSubscription>({ level: 'free', subscription: null });

  private readonly premiumModal = premiumModal();

  constructor(private readonly subscriptionService: SubscriptionService) {
    this.loading.set(true);
    this.subscriptionService
      .getSubscription()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(this.subscription.set);
  }

  onChangeColor(colorPicker: HTMLInputElement) {
    if (!canUseCustomizationFeatures(this.subscription().level)) {
      return this.premiumModal.open();
    }
    colorPicker.click();
  }

  handleColorChange(color: string) {
    const hex = colorToHex(color);
    this.onChange.emit(hex);
  }
}
