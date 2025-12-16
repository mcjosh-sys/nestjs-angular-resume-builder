import { Routes } from '@angular/router';
import { ResumesComponent } from './pages/resumes/resumes.component';

export const RESUME_ROUTES: Routes = [
  {
    path: '',
    component: ResumesComponent,
    data: {
      title: 'Your Resumes',
    },
  },
];
