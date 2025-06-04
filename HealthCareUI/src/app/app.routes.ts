import { Routes } from '@angular/router';
import { ConfirmEmailComponent } from './feature/Auth/confirm-email/confirm-email.component';
import { RegistrationComponent } from './feature/Auth/Registration/registration.component';

import { HomeComponent } from './feature/home/home.component';
import { LoginComponent } from './feature/Auth/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'confirm-email', component: LoginComponent },
  { path: 'login', component: ConfirmEmailComponent },
];
