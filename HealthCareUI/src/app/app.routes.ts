import { Routes } from '@angular/router';
import { HomeComponent } from './feature/home/home.component';
import { ConfirmEmailComponent, ForgotPasswordComponent, 
        LoginComponent, RegistrationComponent, ResetPasswordComponent } from './feature/Auth';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  { path: 'login', component: LoginComponent},
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'forgot-password', component:ForgotPasswordComponent}
];
