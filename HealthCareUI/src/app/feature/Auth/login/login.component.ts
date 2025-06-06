import { HttpClient } from '@angular/common/http';
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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FontAwesomeModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  showPassword = false;
  loginForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
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
      const formData = this.loginForm.value;

      const payload = {
        UsernameOrEmail: formData.UsernameOrEmail,
        password: formData.password,
      };
      let message = '';
      this.http
        .post('https://localhost:5169/api/auth/login', payload)
        .subscribe({
          next: (response: any) => {
            console.log('Login thành công:', response);
            this.router.navigate(['/home']);
          },
          error: (error) => {
            if (typeof error.error === 'string') {
              message = error.error;
            } else if (error.error && typeof error.error === 'object') {
              message = error.error.message ?? JSON.stringify(error.error);
            } else {
              message = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
            }

            alert(message);
            this.isSubmitting = false;
          },
        });
    }
  }
}
