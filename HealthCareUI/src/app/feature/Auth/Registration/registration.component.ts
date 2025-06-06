import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registrationForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.isSubmitting = true;
      const formData = this.registrationForm.value;

      // Tạo payload theo format API yêu cầu
      const payload = {
        email: formData.email,
        firstName: formData.firstname,
        lastName: formData.lastname,
        userName: formData.username,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        dateOfBirth: formData.dateOfBirth,
      };

      // Gọi API đăng ký
      this.http
        .post('https://localhost:7132/api/auth/register', payload)
        .subscribe({
          next: (response: any) => {
            // Chuyển đến trang xác nhận email với email đã đăng ký
            this.router.navigate(['/confirm-email'], {
              queryParams: {
                email: formData.email,
                status: 'registration',
              },
            });
          },
          error: (error) => {
            console.error('Registration error:', error);
            if (error.error && typeof error.error === 'object') {
              // Xử lý validation errors từ server
              if (error.error.errors) {
                const errorMessages = Object.values(error.error.errors).flat();
                alert(errorMessages.join('\n'));
              } else if (error.error.message) {
                alert(error.error.message);
              }
            } else {
              alert('Đăng ký thất bại. Vui lòng thử lại.');
            }
            this.isSubmitting = false;
          },
        });
    } else {
      // Đánh dấu tất cả các trường là đã touched để hiển thị validation messages
      Object.keys(this.registrationForm.controls).forEach((key) => {
        const control = this.registrationForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
}
