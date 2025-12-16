import { Routes } from '@angular/router';
import { pendingChangesGuard } from './guards/pending-changes-guard';
import { EditorComponent } from './pages/editor/editor.component';

export const EDITOR_ROUTES: Routes = [
  {
    path: '',
    canDeactivate: [pendingChangesGuard],
    component: EditorComponent,
    data: {
      title: 'Design your resume',
    },
  },
];
