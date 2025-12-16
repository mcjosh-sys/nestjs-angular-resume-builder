import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'sign-in',
    component: LoginComponent,
    data: {
      title: 'Sign In',
      description: 'Sign in to your account',
    },
  },
  {
    path: 'sign-up',
    component: RegisterComponent,
    data: {
      title: 'Sign Up',
      description: 'Create a new account',
    },
  },
];
