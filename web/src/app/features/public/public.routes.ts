import { Route } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { TermsOfServiceComponent } from './pages/terms-of-service/terms-of-service.component';

export const PUBLIC_ROUTES: Route[] = [
  {
    path: '',
    component: LandingComponent,
    data: {
      title: 'AI Resume Builder',
    },
  },
  {
    path: 'terms-of-service',
    component: TermsOfServiceComponent,
  },
];
