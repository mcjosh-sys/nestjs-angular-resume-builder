import { computed, DestroyRef, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs';
import { SearchParamsService } from 'src/app/core/services/search-params/search-params.service';

export const editorSteps = [
  'general-info',
  'personal-info',
  'work-experience',
  'education',
  'skills',
  'summary',
] as const;
export type EditorStep = (typeof editorSteps)[number];

export interface EditorStepData {
  key: EditorStep;
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class EditorStepService {
  private readonly _steps: EditorStepData[] = [
    {
      key: 'general-info',
      title: 'General Info',
    },
    {
      key: 'personal-info',
      title: 'Personal Info',
    },
    {
      key: 'work-experience',
      title: 'Work Experience',
    },
    {
      key: 'education',
      title: 'Education',
    },
    {
      key: 'skills',
      title: 'Skills',
    },
    {
      key: 'summary',
      title: 'Summary',
    },
  ];

  private readonly _current = signal(this._steps[0]);
  readonly current = this._current.asReadonly();
  readonly previousStep = computed(() => {
    const index = this._steps.findIndex((s) => s.key === this._current().key);
    return this._steps?.[index - 1] ?? null;
  });
  readonly nextStep = computed(() => {
    const index = this._steps.findIndex((s) => s.key === this._current().key);
    return this._steps?.[index + 1] ?? null;
  });

  get steps() {
    return this._steps;
  }

  constructor(
    private readonly destroyRef: DestroyRef,
    private readonly params: SearchParamsService<{ step: EditorStep }>,
  ) {
    params
      .observe('step')
      .pipe(takeUntilDestroyed(this.destroyRef), distinctUntilChanged())
      .subscribe((step) => {
        this.setCurrentStep(step, true);
      });
  }

  setCurrentStep(step: EditorStep | null, skipParams = false) {
    // console.log({ editorSteps, step, present: editorSteps.includes(step as any) });
    if (step && editorSteps.includes(step)) {
      this._current.set(this._steps.find((s) => s.key === step)!);
      if (!skipParams) this.params.set('step', step);
    } else {
      this._current.set(this._steps[0]);
      if (!skipParams) this.params.remove('step');
    }
  }
}
