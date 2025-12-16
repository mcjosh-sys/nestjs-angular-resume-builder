import { Component, Signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMoon, lucideSun } from '@ng-icons/lucide';
import { BrnMenuTrigger } from '@spartan-ng/brain/menu';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmMenu, HlmMenuGroup, HlmMenuItem } from '@spartan-ng/helm/menu';
import { Theme, ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  imports: [NgIcon, HlmIcon, HlmMenu, HlmMenuGroup, HlmMenuItem, HlmButton, BrnMenuTrigger],
  providers: [provideIcons({ lucideSun, lucideMoon })],
  template: `
    @if (isBrowser()) {
      <button hlmBtn variant="outline" [brnMenuTriggerFor]="menu">
        <ng-icon hlm size="sm" [name]="theme() === 'dark' ? 'lucideMoon' : 'lucideSun'" />
        <span class="sr-only">Toggle theme</span>
      </button>
      <ng-template #menu>
        <hlm-menu>
          <hlm-menu-group>
            <button hlmMenuItem (click)="setTheme('light')">Light</button>
            <button hlmMenuItem (click)="setTheme('dark')">Dark</button>
            <button hlmMenuItem (click)="setTheme('system')">System</button>
          </hlm-menu-group>
        </hlm-menu>
      </ng-template>
    }
  `,
})
export class ThemeToggleComponent {
  protected theme!: Signal<Theme>;
  protected isBrowser!: Signal<boolean>;

  constructor(private themeService: ThemeService) {
    this.theme = themeService.currentTheme;
    this.isBrowser = themeService.isBrowser;
  }

  setTheme(theme: Theme) {
    this.themeService.setTheme(theme);
  }
}
