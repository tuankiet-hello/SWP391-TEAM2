import { Routes } from '@angular/router';
import { ConfirmEmailComponent } from './feature/Auth/confirm-email/confirm-email.component';
import { RegistrationComponent } from './feature/Auth/Registration/registration.component';

export const routes: Routes = [
  { path: '', redirectTo: '/registration', pathMatch: 'full' }, // Default route redirects to login
  { path: 'registration', component: RegistrationComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
];
