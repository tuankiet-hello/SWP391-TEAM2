import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../services/manager-user.service';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { EyeOutline, EyeInvisibleOutline } from '@ant-design/icons-angular/icons';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
@Component({
  selector: 'app-create-customer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzIconModule
  ],
  providers: [
    { provide: NZ_ICONS, useValue: [EyeOutline, EyeInvisibleOutline] }
  ],
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css'],
})
export class CreateCustomerComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  // showModal = false;
  hidePassword = true;
  hideConfirm = true;
  createUserForm!: FormGroup;
  // regexusername = '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]+$';
  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.createUserForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        password: [{ value: '12345aA@', disabled: true }], // disabled, không validator
        confirmPassword: [{ value: '12345aA@', disabled: true }],
        role: ['', Validators.required],
      },
    );
  }

  closeModal() {
    this.close.emit();
  }

  submitForm() {
    if (this.createUserForm.valid) {
      const formData = { ...this.createUserForm.getRawValue() };
      const payload = {
        email: formData.email,
        userName: formData.username,
        password: "12345aA@", // Mặc định, không cần nhập
        confirmPassword: "12345aA@", // Mặc định, không cần nhập
        role: formData.role,
      };
      this.userService.createUser(payload).subscribe({
        next: (response: any) => {
          console.log('Thành Công');
        },
        error: (error) => {
          console.error('CreateUser error:', error);
          if (error.error && typeof error.error === 'object') {
            if (error.error.errors) {
              const errorMessages = Object.values(error.error.errors).flat();
              alert(errorMessages.join('\n'));
            } else if (error.error.message) {
              alert(error.error.message);
            }
          } else {
            alert('Thêm thất bại. Vui lòng thử lại.');
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
