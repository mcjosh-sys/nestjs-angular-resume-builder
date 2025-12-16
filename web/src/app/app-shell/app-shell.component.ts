import { Component } from '@angular/core';
import { LoadingComponent } from '@shared/components/ui/loading/loading.component';

@Component({
  selector: 'app-app-shell',
  imports: [LoadingComponent],
  templateUrl: './app-shell.component.html',
})
export class AppShellComponent {}
