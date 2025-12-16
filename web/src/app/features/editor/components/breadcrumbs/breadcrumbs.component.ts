import { Component, Signal } from '@angular/core';
import { BrnMenuImports } from '@spartan-ng/brain/menu';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmMenuImports } from '@spartan-ng/helm/menu';
import { SearchParamsService } from 'src/app/core/services/search-params/search-params.service';
import { EditorStep, EditorStepData, EditorStepService } from '../../services/editor-step.service';

@Component({
  selector: 'app-editor-breadcrumbs',
  imports: [HlmBreadCrumbImports, BrnMenuImports, HlmMenuImports],
  template: `
    <nav hlmBreadcrumb>
      <ol hlmBreadcrumbList>
        @for (step of steps; track step.key) {
          <li hlmBreadcrumbItem>
            @if (currentStep().key === step.key) {
              <span hlmBreadcrumbPage>{{ step.title }}</span>
            } @else {
              <a hlmBreadcrumbLink>
                <button (click)="setCurrentStep(step.key)">{{ step.title }}</button>
              </a>
            }
          </li>
          <li hlmBreadcrumbSeparator class="last:hidden"></li>
        }
      </ol>
    </nav>
  `,
})
export class BreadcrumbsComponent {
  steps: EditorStepData[] = [];
  currentStep!: Signal<EditorStepData>;

  constructor(
    private readonly stepService: EditorStepService,
    private readonly params: SearchParamsService<{ step: EditorStep }>,
  ) {
    this.steps = this.stepService.steps;
    this.currentStep = this.stepService.current;
  }

  setCurrentStep(step: EditorStep) {
    this.stepService.setCurrentStep(step);
  }
}
