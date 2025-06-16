import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FontAwesomeModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showConfirmPassword = false;
  showPassword = false;
  registrationForm: FormGroup;
  isSubmitting = false;
  regexpassword =
    '^[A-Z](?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/\\?]).{5,}$';
  regexusername = '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]+$';
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registrationForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: [
          '',
          [Validators.required, Validators.pattern(this.regexusername)],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/ ),
          ],
        ],
        confirmPassword: ['', Validators.required],
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
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  // component.ts
  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.isSubmitting = true;
      const formData = this.registrationForm.value;

      const payload = {
        email: formData.email,
        userName: formData.username,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      this.authService.register(payload).subscribe({
        next: (response: any) => {
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
      Object.keys(this.registrationForm.controls).forEach((key) => {
        const control = this.registrationForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

}
