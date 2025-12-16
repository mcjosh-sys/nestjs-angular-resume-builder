import { Routes } from '@angular/router';
import { BillingSuccessComponent } from './pages/billing-success/billing-success.component';
import { BillingComponent } from './pages/billing/billing.component';
export const BILLING_ROUTES: Routes = [
  {
    path: '',
    component: BillingComponent,
  },
  {
    path: 'success',
    component: BillingSuccessComponent,
  },
];
