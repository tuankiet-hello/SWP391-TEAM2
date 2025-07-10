import { TestService , TestDTO} from './../../../../services/test.service';
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
  selector: 'app-create-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzIconModule],
  providers: [
    { provide: NZ_ICONS, useValue: [EyeOutline, EyeInvisibleOutline] },
  ],
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css'],
})
export class CreateCustomerComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() testCreated = new EventEmitter<void>();
  // showModal = false;
  hidePassword = true;
  hideConfirm = true;
  createUserForm!: FormGroup;
  createTestForm!: FormGroup;
  role: string | null = null;
  // regexusername = '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]+$';
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private testService: TestService,
    private authService: AuthService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRoleFromToken();
    console.log('🧑‍💼 role:', this.role);
    if (this.role === 'staff') {
      this.createUserForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        password: [{ value: '12345aA@', disabled: true }], // disabled, không validator
        confirmPassword: [{ value: '12345aA@', disabled: true }],
        role: ['', Validators.required],
      });
    } else if (this.role === 'manager') {
      this.createTestForm = this.fb.group({
        TestName: ['', Validators.required],
        Price: ['', Validators.required],
        Description: ['', [Validators.required]],
        active: [true],
      });
    }
  }
  onAddTest(): void {
    const payload = this.createTestForm.value;
    this.testService.addTest(payload).subscribe({
      next: () => {
        // alert('✅ Thêm test thành công!');
        this.createTestForm.reset({ Active: true }); // reset form
        this.testCreated.emit();
        this.closeModal();
        // this.loadTests(); // load lại danh sách
      },
      error: (err) => {
        console.error('❌ Lỗi khi thêm test:', err);
        this.message.error('Failed to add test. Please check again!');
      },
    });
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
        password: '12345aA@', // Mặc định, không cần nhập
        confirmPassword: '12345aA@', // Mặc định, không cần nhập
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
