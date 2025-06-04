import { Routes } from '@angular/router';
import { HomeComponent } from './feature/home/home.component';
import { ConfirmEmailComponent, ForgotPasswordComponent, LoginComponent, RegistrationComponent, ResetPasswordComponent } from './feature/Auth';

export const routes: Routes = [
  //cái này để trên cùng
  { path: '', redirectTo: 'home', pathMatch: 'full' },//mới khởi tạo đẩy về home
  //pathMatch là khi đường dẫn URL là hoàn toàn rỗng (''), thì mới chuyển hướng sang /home.


  { path: 'home', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'registration', component: RegistrationComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent},


  //cái này phải để cuối cùng
  { path: '**', redirectTo: 'home' },//invalid đẩy về home
];//ko chơi thay đổi thứ tự route nha mấy ní
