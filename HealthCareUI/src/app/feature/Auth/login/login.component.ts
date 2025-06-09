import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FontAwesomeModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;
  loginForm: FormGroup;
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      UsernameOrEmail: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      const { UsernameOrEmail, password } = this.loginForm.value;
      const payload = { UsernameOrEmail, password };

      this.authService.login(payload).subscribe({
        next: (response: any) => {
          console.log('Login thành công:', response);
          localStorage.setItem('accessToken', response.token); // lưu token
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.isSubmitting = false;

          // 👉 Reset các lỗi cũ
          this.loginForm.get('UsernameOrEmail')?.setErrors(null);
          this.loginForm.get('password')?.setErrors(null);
          this.loginForm.setErrors(null);

          const message = error.error;

          if (typeof message === 'string') {
            if (message.includes('username') || message.includes('email')) {
              this.loginForm
                .get('UsernameOrEmail')
                ?.setErrors({ backend: '*' + message });
            } else if (message.includes('password')) {
              this.loginForm
                .get('password')
                ?.setErrors({ backend: '*' + message });
            }
          } else {
            this.loginForm.setErrors({
              backend: 'Đăng nhập thất bại. Vui lòng thử lại.',
            });
          }
        },
      });
    }
  }
}
