import { Routes } from '@angular/router';
import {
  ConfirmEmailComponent,
  ForgotPasswordComponent,
  LoginComponent,
  RegistrationComponent,
  ResetPasswordComponent,
} from './feature/Auth';

import {
  ManagerUsersComponent,
  ManagerCustomersComponent,
  ViewConsultationScheduleComponent,
  ManageServiceComponent,
  ViewQuestionComponent,
} from './manager';

import {
  HomeComponent,
  Blog1Component,
  Blog2Component,
  Blog3Component,
  Blog4Component,
  Blog5Component,
  SexualTestingComponent,
  ManageProfileComponent,
} from './feature/client';
import { ViewTestBookingComponent } from './manager/staff/view-test-booking/view-test-booking.component';
import { EditProfileComponent } from './feature/client/edit-profile/edit-profile.component';
import { ConfirmChangeEmailComponent } from './feature/client/confirm-change-email/confirm-change-email.component';
import { MenstrualCycleComponent } from './feature/client/menstrual-cycle/menstrual-cycle.component';


export const routes: Routes = [
  //cái này để trên cùng
  { path: '', redirectTo: 'home', pathMatch: 'full' }, //mới khởi tạo đẩy về home
  //pathMatch là khi đường dẫn URL là hoàn toàn rỗng (''), thì mới chuyển hướng sang /home.

  //Client routes
  { path: 'home', component: HomeComponent },
  { path: 'sexual-testing', component: SexualTestingComponent },
  { path: 'edit-profile-customer', component: EditProfileComponent },
  { path: 'manage-profile-customer', component: ManageProfileComponent },

  {
    path: 'blog/top-7-things-you-should-know-about-stis',
    component: Blog1Component,
  },
  { path: 'blog/how-safe-are-condoms', component: Blog2Component },
  {
    path: 'blog/how-to-talk-about-sex-with-your-teen',
    component: Blog3Component,
  },
  {
    path: 'blog/fetal-development-stages-of-growth',
    component: Blog4Component,
  },
  {
    path: 'blog/sexually-transmitted-infections-stis',
    component: Blog5Component,
  },
  { path: 'menstrual-cycle', component: MenstrualCycleComponent },
  //Authentication routes
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'confirm-change-email', component: ConfirmChangeEmailComponent },
  //Admin routes
  { path: 'manager-users', component: ManagerUsersComponent },

  //Manager routes
  { path: 'manager-customers', component: ManagerCustomersComponent },
  { path: 'manage-service', component: ManageServiceComponent },

  //Staff routes
  { path: 'view-test-booking', component: ViewTestBookingComponent },

  //Consultant routes
  {
    path: 'view-consultation-schedule',
    component: ViewConsultationScheduleComponent,
  },
  { path: 'view-question', component: ViewQuestionComponent },
  //customer
  { path: 'menstrual-cycle', component: MenstrualCycleComponent },
  //cái này phải để cuối cùng
  { path: '**', redirectTo: 'home' }, //invalid đẩy về home
]; //ko chơi thay đổi thứ tự route nha mấy ní
