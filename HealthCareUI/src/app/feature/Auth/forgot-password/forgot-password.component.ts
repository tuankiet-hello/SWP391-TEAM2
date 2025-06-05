import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm!: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]{2,}){1,2}$/)
      ]]
    });
  }

  get email() {
    return this.forgotForm.get('email')!;
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) return;

    this.isSubmitting = true;

    const email = this.forgotForm.value.email;

    this.http.post('https://your-api.com/api/forgot-password', { email }).subscribe({
      next: () => {
        alert('A reset link has been sent to your email.');
        this.forgotForm.reset();
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Forgot password error:', err);
        alert('Failed to send reset link. Please try again.');
        this.isSubmitting = false;
      }
    });
  }
}
