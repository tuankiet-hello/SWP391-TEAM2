import { Routes } from '@angular/router';
import { HomeComponent } from './feature/home/home.component';
import { ConfirmEmailComponent, LoginComponent, RegistrationComponent, ResetPasswordComponent } from './feature/Auth';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },//mới khởi tạo đẩy về home
  { path: '**', redirectTo: 'home' },//invalid đẩy về home
  { path: 'registration', component: RegistrationComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  { path: 'login', component: LoginComponent},
  { path: 'reset-password', component: ResetPasswordComponent},
];
