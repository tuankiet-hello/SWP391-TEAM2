import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  submitted = false;
  email = '';
  token = '';
  message = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.resetForm = this.fb.group(
      {
        password: [
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
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'] || '';
      this.email = params['email'] || '';
      
      if (!this.token || !this.email) {
        this.errorMessage = 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn';
        this.resetForm.disable();
      } else {
        console.log('Token và email hợp lệ:', { email: this.email, tokenLength: this.token.length });
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const pwd = form.get('password')?.value;
    const cpwd = form.get('confirmPassword')?.value;
    return pwd === cpwd ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.isLoading) return;
    
    this.submitted = true;
    this.errorMessage = '';
    this.message = '';

    if (!this.resetForm.valid) {
      console.log('Form không hợp lệ:', this.resetForm.errors);
      if (this.resetForm.errors?.['mismatch']) {
        this.errorMessage = 'Mật khẩu xác nhận không khớp';
      } else if (this.passwordControl?.errors?.['pattern']) {
        this.errorMessage = 'Mật khẩu phải chứa ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt';
      } else {
        this.errorMessage = 'Vui lòng điền đầy đủ thông tin';
      }
      return;
    }

    if (!this.email || !this.token) {
      this.errorMessage = 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn';
      return;
    }

    this.isLoading = true;
    const formData = this.resetForm.value;

    const payload = {
      email: this.email,
      token: this.token,
      newPassword: formData.password,
      confirmPassword: formData.confirmPassword,
    };

    console.log('Gửi request với payload:', {
      email: payload.email,
      tokenLength: payload.token.length,
      passwordLength: payload.newPassword.length
    });

    this.http
      .post('https://localhost:7132/api/Auth/reset-password', payload)
      .subscribe({
        next: (response: any) => {
          console.log('Success:', response);
          this.message = 'Đổi mật khẩu thành công! Đang chuyển hướng về trang đăng nhập...';
          this.resetForm.reset();
          this.resetForm.disable();
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 5000);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Chi tiết lỗi:', {
            status: error.status,
            statusText: error.statusText,
            error: error.error,
            message: error.message
          });

          if (error.status === 400) {
            if (error.error?.message) {
              this.errorMessage = error.error.message;
            } else if (error.error?.errors) {
              const errors = error.error.errors;
              console.log('Validation errors:', errors);
              
              if (errors.NewPassword) {
                this.errorMessage = errors.NewPassword[0];
              } else if (errors.ConfirmPassword) {
                this.errorMessage = errors.ConfirmPassword[0];
              } else if (errors.Token) {
                this.errorMessage = 'Token không hợp lệ hoặc đã hết hạn';
              } else if (errors.Email) {
                this.errorMessage = 'Email không hợp lệ';
              } else {
                // Log tất cả các lỗi để debug
                const errorKeys = Object.keys(errors);
                console.log('Các trường bị lỗi:', errorKeys);
                this.errorMessage = 'Vui lòng kiểm tra lại thông tin và thử lại';
              }
            } else {
              this.errorMessage = 'Đổi mật khẩu thất bại. Vui lòng thử lại sau.';
            }
          } else if (error.status === 404) {
            this.errorMessage = 'Không tìm thấy tài khoản với email này';
          } else {
            this.errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
          }
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  // Helper methods for template
  get passwordControl() {
    return this.resetForm.get('password');
  }

  get confirmPasswordControl() {
    return this.resetForm.get('confirmPassword');
  }
}
