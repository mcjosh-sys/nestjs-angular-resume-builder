import { Component, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoaderCircle } from '@ng-icons/lucide';
import { PremiumModalComponent } from '@shared/components/premium-modal/premium-modal.component';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { ClerkService } from 'src/app/core/services/clerk/clerk.service';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    NavbarComponent,
    NgIcon,
    HlmIcon,
    HlmToasterImports,
    PremiumModalComponent,
  ],
  providers: [provideIcons({ lucideLoaderCircle })],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {
  protected isClerkLoaded!: Signal<boolean>;

  constructor(private readonly clerk: ClerkService) {
    this.isClerkLoaded = this.clerk.isLoaded;
  }
}
