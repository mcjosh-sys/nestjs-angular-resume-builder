import { computed, Directive, ElementRef, signal } from '@angular/core';
import { PlatformService } from 'src/app/core/services/platform.service';

@Directive({
  selector: '[appDimensions]',
  exportAs: 'dimensions',
})
export class DimensionsDirective {
  private readonly el!: HTMLElement;
  private resizeObserver?: ResizeObserver;

  private readonly _width = signal(0);
  private readonly _height = signal(0);

  readonly width = this._width.asReadonly();
  readonly height = this._height.asReadonly();
  readonly dimensions = computed(() => ({ width: this._width(), height: this._height() }));

  constructor(
    private readonly platform: PlatformService,
    el: ElementRef<HTMLElement>,
  ) {
    this.el = el.nativeElement;
  }

  ngOnInit(): void {
    if (!this.platform.isBrowser()) return;

    this.resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;

      this._width.set(width);
      this._height.set(height);
    });

    this.resizeObserver.observe(this.el);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }
}
