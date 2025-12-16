import {
  provideHttpClient,
  withInterceptors,
  withRequestsMadeViaParent,
} from '@angular/common/http';
import { Routes } from '@angular/router';
import { ResumeAiService } from 'src/app/core/services/resume/resume-ai.service';
import { authGuard } from './core/guards/auth-guard';
import { ResumeService } from './core/services/resume/resume.service';
import { SubscriptionService } from './core/services/resume/subscription.service';
import { authInterceptor } from './features/auth/interceptors/auth-interceptor';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    loadChildren: () => import('./features/public/public.routes').then((m) => m.PUBLIC_ROUTES),
  },
  {
    path: '',
    component: AuthLayoutComponent,
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    canActivate: [authGuard],
    component: MainLayoutComponent,
    loadChildren: () => import(`./layouts/main-layout/main.routes`).then((m) => m.MAIN_ROUTES),
    providers: [
      provideHttpClient(withInterceptors([authInterceptor]), withRequestsMadeViaParent()),
      {
        provide: ResumeService,
        useClass: ResumeService,
      },
      {
        provide: ResumeAiService,
        useClass: ResumeAiService,
      },
      {
        provide: SubscriptionService,
        useClass: SubscriptionService,
      },
    ],
  },
];
