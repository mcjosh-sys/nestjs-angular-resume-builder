import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButton } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-billing-success',
  imports: [RouterLink, HlmButton],
  templateUrl: './billing-success.component.html',
})
export class BillingSuccessComponent {}
