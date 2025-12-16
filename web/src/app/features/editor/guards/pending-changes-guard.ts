import { CanDeactivateFn } from '@angular/router';
import { EditorComponent } from '../pages/editor/editor.component';

export const pendingChangesGuard: CanDeactivateFn<EditorComponent> = (
  component,
  _currentRoute,
  _currentState,
  _nextState,
) => {
  if (component?.hasUnsavedChanges() && !component?.ignoreBeforeUnload()) {
    return confirm('You have unsaved changes. Are you sure you want to leave this page?');
  }
  return true;
};
