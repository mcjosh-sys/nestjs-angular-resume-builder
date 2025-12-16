import {
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  Injector,
  Provider,
  Type,
} from '@angular/core';

interface MountComponentOptions<T> {
  el: HTMLElement;
  component: Type<T>;
  environmentInjector: EnvironmentInjector;
  inputs?: Partial<{ [K in keyof T]: any }>;
  providers?: Provider[];
}

export function mountComponent<T>({
  el,
  component,
  environmentInjector,
  inputs,
  providers,
}: MountComponentOptions<T>): ComponentRef<T> {
  const elementInjector = providers?.length
    ? Injector.create({ providers, parent: environmentInjector })
    : undefined;

  const compRef = createComponent(component, {
    hostElement: el,
    environmentInjector: environmentInjector,
    elementInjector,
  });

  if (inputs) {
    Object.entries(inputs).forEach(([key, value]) => {
      compRef.setInput(key, value);
    });
  }

  compRef.changeDetectorRef.detectChanges();

  return compRef;
}
