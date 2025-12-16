import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'terms-of-service',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'sign-in',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'sign-up',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
