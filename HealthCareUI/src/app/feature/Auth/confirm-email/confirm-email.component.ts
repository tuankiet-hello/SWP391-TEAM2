import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css'],
})
export class ConfirmEmailComponent implements OnInit {
  status: 'pending' | 'success' | 'error' | 'registration' = 'pending';
  message: string = '';
  email: string = '';
  token: string = '';

  // Payload object để gửi đến API
  payload: { email: string; token: string } = { email: '', token: '' };

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const status = params['status'];
      this.token = params['token'] || '';
      this.email = params['email'] || '';

      console.log('Raw URL params:', {
        email: this.email,
        token: this.token,
        status,
      });

      // Cập nhật payload với giá trị nguyên bản từ URL
      this.payload = {
        email: this.email,
        token: this.token,
      };

      if (status === 'registration') {
        this.status = 'registration';
      } else if (this.email && this.token) {
        this.confirmEmail();
      } else {
        this.status = 'error';
        this.message = 'Thiếu thông tin xác nhận email';
      }
    });
  }

  confirmEmail() {
    this.status = 'pending';
    console.log('Sending confirmation request with payload:', this.payload);

    this.authService.confirmEmail(this.payload).subscribe({
      next: (response: any) => {
        console.log('Success:', response);
        this.status = 'success';
        this.message = response.message || 'Xác nhận email thành công!';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 5000);
      },
      error: (error) => {
        console.error('Error:', error);
        this.status = 'error';
        this.message =
          error.error?.message || 'Xác nhận email thất bại. Vui lòng thử lại.';
      },
    });
  }

  resendConfirmationEmail() {
    if (!this.email) {
      alert('Email không hợp lệ');
      return;
    }

    this.authService.resendConfirmationEmail(this.email).subscribe({
      next: (response: any) => {
        alert('Đã gửi lại email xác nhận. Vui lòng kiểm tra hộp thư của bạn.');
      },
      error: (error) => {
        alert(
          error.error?.message ||
            'Không thể gửi lại email xác nhận. Vui lòng thử lại sau.'
        );
      },
    });
  }
}
