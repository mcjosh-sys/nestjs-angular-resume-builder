import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButton } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-landing',
  imports: [NgOptimizedImage, RouterLink, HlmButton],
  templateUrl: './landing.component.html',
})
export class LandingComponent {}
