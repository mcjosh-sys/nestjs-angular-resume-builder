import { Directive, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[appAsChild]',
})
export class AsChildDirective {
  @Input() link!: string | any[];

  constructor(private router: Router) {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.preventDefault();
    console.log(this.link);
    if (this.link) {
      this.router.navigate(Array.isArray(this.link) ? this.link : [this.link]);
    }
  }
}
