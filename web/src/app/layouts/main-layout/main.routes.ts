import { Routes } from '@angular/router';

export const MAIN_ROUTES: Routes = [
  {
    path: 'resumes',
    loadChildren: () => import('../../features/resume/resume.routes').then((m) => m.RESUME_ROUTES),
  },
  {
    path: 'billing',
    loadChildren: () =>
      import('../../features/billing/billing.routes').then((m) => m.BILLING_ROUTES),
  },
  {
    path: 'editor',
    loadChildren: () => import('../../features/editor/editor.routes').then((m) => m.EDITOR_ROUTES),
  },
];
