import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit {
  status: 'pending' | 'success' | 'error' | 'registration' = 'pending';
  message: string = '';
  email: string = '';
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Lấy các tham số từ URL
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.token = params['token'] || '';
      const status = params['status'] || '';

      if (status === 'registration') {
        // Hiển thị màn hình đăng ký thành công
        this.status = 'registration';
      } else if (this.email && this.token) {
        // Xác nhận email
        this.confirmEmail();
      } else if (!this.email) {
        this.status = 'error';
        this.message = 'Thiếu thông tin xác nhận email.';
      }
    });
  }

  confirmEmail() {
    this.status = 'pending';

    // Log thông tin debug
    console.log('Attempting to confirm email with:', {
      email: this.email,
      token: this.token
    });

    // Tạo payload cho request
    const payload = {
      email: this.email,
      token: this.token
    };

    // Gọi API với phương thức POST thay vì GET
    this.http.post('https://localhost:7132/api/auth/confirm-email', payload)
      .subscribe({
        next: (response: any) => {
          console.log('Confirmation successful:', response);
          this.status = 'success';
          this.message = 'Xác nhận email thành công! Bạn có thể đăng nhập ngay bây giờ.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (error) => {
          console.error('Confirmation failed:', error);
          this.status = 'error';
          if (error.error && typeof error.error === 'string') {
            this.message = error.error;
          } else if (error.error && error.error.message) {
            this.message = error.error.message;
          } else {
            this.message = 'Token không hợp lệ hoặc đã hết hạn.';
          }
        }
      });
  }

  resendConfirmationEmail() {
    if (this.email) {
      // Log thông tin debug
      console.log('Attempting to resend confirmation email to:', this.email);

      this.http.post('https://localhost:7132/api/auth/resend-confirm-email', { email: this.email })
        .subscribe({
          next: (response: any) => {
            console.log('Resend confirmation successful:', response);
            alert('Đã gửi lại email xác nhận. Vui lòng kiểm tra hộp thư của bạn.');
          },
          error: (error) => {
            console.error('Resend confirmation failed:', error);
            if (error.error && typeof error.error === 'string') {
              alert(error.error);
            } else if (error.error && error.error.message) {
              alert(error.error.message);
            } else {
              alert('Không thể gửi lại email xác nhận. Vui lòng thử lại sau.');
            }
          }
        });
    }
  }
}
