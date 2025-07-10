import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../services/manager-user.service';
import { AuthService } from '../../../../services/auth.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  EyeOutline,
  EyeInvisibleOutline,
} from '@ant-design/icons-angular/icons';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzIconModule],
  providers: [
    { provide: NZ_ICONS, useValue: [EyeOutline, EyeInvisibleOutline] },
  ],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
})
export class CreateUserComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  // showModal = false;
  role: string | null = null;
  hidePassword = true;
  hideConfirm = true;
  createUserForm!: FormGroup;
  regexusername = '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]+$';
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRoleFromToken();
    console.log('🧑‍💼 role:', this.role);
    this.createUserForm = this.fb.group(
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
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
        role: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
    // console.log('CreateUserComponent rendered');
  }
  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  closeModal() {
    this.close.emit();
  }

  submitForm() {
    console.log('GỌI submitForm()');
    // console.log('Valid:', this.createUserForm.valid);
    // console.log('Errors:', this.createUserForm.errors);

    if (this.createUserForm.valid) {
      const formData = { ...this.createUserForm.value };
      const payload = {
        email: formData.email,
        userName: formData.username,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
      };
      this.userService.createUser(payload).subscribe({
        next: (response: any) => {
          console.log('Thành Công');
          this.message.success('User created successfully!');

        },
        error: (error) => {
          console.error('CreateUser error:', error);
          if (error.error && typeof error.error === 'object') {
            if (error.error.errors) {
              const errorMessages = Object.values(error.error.errors).flat();
              this.message.error(errorMessages.join('\n'));
            } else if (error.error.message) {
              this.message.error(error.error.message);
            }
          } else {
            this.message.error('Failed to add user. Please try again.');
          }
          // this.isSubmitting = false;
        },
      });
      this.closeModal();
    } else {
      console.warn('Form KHÔNG hợp lệ', this.createUserForm);
    }
  }
}
