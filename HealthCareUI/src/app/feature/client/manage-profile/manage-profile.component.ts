import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../../../../services/auth.service';
import {
  BookingService,
  TestBookingDTO,
} from '../../../../services/test-booking.service';
import {
  UserService,
  AccountDetailDTO,
} from '../../../../services/manager-user.service';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ViewBookingDetailComponent } from '../../../manager/staff/view-booking-detail/view-booking-detail.component';

interface Booking {
  id: string;
  date: string;
  service: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
}
interface Question {
  id: string;
  date: string;
  title: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
}

@Component({
  selector: 'app-sidebar-profile',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    EditProfileComponent,
    ReactiveFormsModule,
    ViewBookingDetailComponent
  ],
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.css'],
})
export class ManageProfileComponent implements OnInit {
  selectedFeature = 'Your Profile';
  userName: string | null = null;
  userid!: string;
  user!: AccountDetailDTO;
  changePasswordForm: FormGroup;
  message: string = '';
  regexpassword =
    '^[A-Z](?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/\\?]).{5,}$';

  showEditProfile = false;
  statusMap: { [key: number]: string } = {
  0: 'Submitted',
  1: 'Pending',
  2: 'Confirmed',
  3: 'Canceled',
  4: 'Completed'
};
  features = [
    'Your Profile',
    'Change Password',
    'Booking History',
    'Question History',
  ];

  bookings: TestBookingDTO[] = [];
  questions: Question[] = [];
  isPasswordValid: boolean | undefined;
  checkPasswordMessage: string | undefined;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private bookingService: BookingService
  ) {
    this.changePasswordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: [this.passwordsValidator] }
    );
  }
  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')!.value === form.get('confirmPassword')!.value
      ? null
      : { mismatch: true };
  }
  passwordsValidator(form: FormGroup) {
    const current = form.get('currentPassword')?.value;
    const newPwd = form.get('newPassword')?.value;
    const confirm = form.get('confirmPassword')?.value;

    const errors: any = {};

    // Mật khẩu mới phải ít nhất 6 ký tự (có thể bỏ nếu đã dùng Validators.minLength)
    if (newPwd && newPwd.length < 6) {
      errors.newPasswordLength = true;
    }
    // Mật khẩu mới không được trùng mật khẩu cũ
    if (current && newPwd && current === newPwd) {
      errors.duplicatePassword = true;
    }
    // Mật khẩu xác nhận phải khớp
    if (newPwd && confirm && newPwd !== confirm) {
      errors.passwordMismatch = true;
    }

    return Object.keys(errors).length ? errors : null;
  }

  // Hàm kiểm tra mật khẩu hiện tại
  onCheckCurrentPassword() {
    const currentPassword = this.changePasswordForm.value.currentPassword;
    if (!currentPassword) {
      this.isPasswordValid = false;
      this.checkPasswordMessage = '';
      return;
    }
    this.authService.checkCurrentPassword(currentPassword).subscribe({
      next: (res) => {
        if (res.valid) {
          this.isPasswordValid = true;
          this.checkPasswordMessage = '✔️';
        } else {
          this.isPasswordValid = false;
          this.checkPasswordMessage = '❌';
        }
      },
      error: () => {
        this.isPasswordValid = false;
        this.checkPasswordMessage = 'Có lỗi xảy ra khi kiểm tra mật khẩu!';
      },
    });
  }

  onSubmitChangePwd() {
    if (this.changePasswordForm.valid && this.isPasswordValid) {
      const { currentPassword, newPassword, confirmPassword } =
        this.changePasswordForm.value;
      const payload = {
        CurrentPassword: currentPassword,
        NewPassword: newPassword,
        ConfirmNewPassword: confirmPassword,
      };
      this.authService.changePassword(payload).subscribe({
        next: (res) => {
          this.message = res.message || 'Password changed successfully!';
          this.isPasswordValid = false;
          this.checkPasswordMessage = '';
          // Khóa toàn bộ form sau khi đổi thành công
          this.changePasswordForm.disable();
        },
        error: (err) => {
          this.message = err.error?.message || 'Failed to change password!';
        },
      });
    } else {
      this.message = 'Please check your input!';
    }
  }

  ngOnInit(): void {
    console.log('✅ Manage Profile ngOnInit called');
    this.userName = this.authService.getUserNameToken();
    this.userid = this.authService.getIdFromToken();

    this.userService.getUserById(this.userid).subscribe((user) => {
      this.user = user;
      console.log('đã nạp data user', this.user);
    });

    this.loadFakeBookings();
    this.loadFakeQuestions();
  }

  selectFeature(feature: string) {
    this.selectedFeature = feature;
  }
  isModalVisible: boolean = false;
  selectedBooking?: TestBookingDTO;
 viewBookingDetail(id: number): void {
    this.bookingService.getBookingById(id).subscribe((booking) => {
      this.selectedBooking = booking;
      this.isModalVisible = true;
    });
  }
  handleModalCancel(): void {
    this.isModalVisible = false;
    this.selectedBooking = undefined;
  }
  toggleEditProfile() {
    this.showEditProfile = !this.showEditProfile;
  }
  update() {
    this.showEditProfile = !this.showEditProfile;
    this.userService.getUserById(this.userid).subscribe((user) => {
      this.user = user;
      console.log('đã nạp data user sau update', this.user);
    });
  }

  loadFakeBookings() {
    this.bookingService.getBookingHisById(this.userid).subscribe((booking) => {
      this.bookings = booking;
      console.log('Nạp  booking ok', this.bookings);
    });
  }

  loadFakeQuestions(): void {
    this.questions = [
      { id: 'BK001', date: '2025-07-01', title: 'Spa', status: 'Confirmed' },
      { id: 'BK002', date: '2025-07-02', title: 'Massage', status: 'Pending' },
      {
        id: 'BK003',
        date: '2025-07-03',
        title: 'Yoga Class',
        status: 'Cancelled',
      },
      {
        id: 'BK004',
        date: '2025-07-04',
        title: 'Fitness',
        status: 'Confirmed',
      },
      {
        id: 'BK005',
        date: '2025-07-05',
        title: 'Nutrition',
        status: 'Pending',
      },
      {
        id: 'BK006',
        date: '2025-07-06',
        title: 'Swimming',
        status: 'Confirmed',
      },
      {
        id: 'BK007',
        date: '2025-07-07',
        title: 'Haircut',
        status: 'Cancelled',
      },
      { id: 'BK008', date: '2025-07-08', title: 'Facial', status: 'Confirmed' },
    ];
  }
}
