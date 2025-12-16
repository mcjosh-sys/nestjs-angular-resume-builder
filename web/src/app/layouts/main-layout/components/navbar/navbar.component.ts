import { NgOptimizedImage } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeToggleComponent } from '@shared/components/theme-switcher/theme-toggle.component';
import { UserButtonComponent } from '@shared/components/user-button/user-button.component';
import { ClerkService } from 'src/app/core/services/clerk/clerk.service';

@Component({
  selector: 'app-navbar',
  imports: [UserButtonComponent, RouterLink, NgOptimizedImage, ThemeToggleComponent],
  template: `
    <header class="shadow-sm">
      <nav class="max-w-7xl mx-auto p-3 flex items-center justify-between gap-3">
        <a routerLink="/" class="flex items-center gap-2">
          <img
            ngSrc="/assets/images/logo.png"
            alt="logo"
            width="35"
            height="35"
            class="rounded-full"
          />
          <span class="text-xl font-bold tracking-tight">AI Resume Builder</span>
        </a>
        <div class="flex items-center gap-3">
          <app-theme-toggle></app-theme-toggle>
          @if (isSignedIn()) {
            <app-user-button></app-user-button>
          } @else {
            <a class="btn btn-primary" routerLink="/sign-in">Sign In</a>
          }
        </div>
      </nav>
    </header>
  `,
  host: {
    class: 'w-full',
  },
})
export class NavbarComponent {
  isSignedIn!: Signal<boolean>;

  constructor(private readonly clerk: ClerkService) {
    this.isSignedIn = this.clerk.isSignedIn;
  }
}
