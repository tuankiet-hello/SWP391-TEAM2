import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  AsyncValidatorFn,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import { AuthService } from './../../../../services/auth.service';
import {
  UserService,
  AccountDetailDTO,
} from '../../../../services/manager-user.service';
import { Router } from '@angular/router';
import { map, of, switchMap, timer } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  form!: FormGroup;
  originalEmail: string = '';
  originalUserName: string = '';
  successMessage: string = '';
  isFormDisabled: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Input() user!: AccountDetailDTO;
  constructor(
    private fb: FormBuilder,
    private userService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      userName: ['', [Validators.required], [this.userNameAsyncValidator()]],
      email: [
        '',
        [Validators.required, Validators.email],
        [this.emailAsyncValidator()],
      ],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: [null, [cannotClearIfHasValue(this.user?.firstName)]],
      dateOfBirth: ['', Validators.required],
    });
    // this.form.patchValue(this.user);

    this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.form.patchValue({
          userName: data.userName,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          dateOfBirth: data.dateOfBirth
            ? data.dateOfBirth.substring(0, 10)
            : '',
        });
        this.originalUserName = data.userName;
        this.originalEmail = data.email;
        this.form
          .get('userName')
          ?.setAsyncValidators(this.userNameAsyncValidator());
        this.form.get('userName')?.updateValueAndValidity({ onlySelf: true });
        this.form.get('email')?.setAsyncValidators(this.emailAsyncValidator());
        this.form.get('email')?.updateValueAndValidity({ onlySelf: true });
      },
      error: (err) => {
        console.error('Lỗi khi lấy thông tin user:', err);
      },
    });
  }

  userNameAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value || control.value === this.originalUserName)
        return of(null);
      return timer(500).pipe(
        switchMap(() => this.userService.checkUserNameAvailable(control.value)),
        map((res) => (res.exists ? { userNameTaken: true } : null))
      );
    };
  }

  emailAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value || control.value === this.originalEmail)
        return of(null);
      return timer(500).pipe(
        switchMap(() => this.userService.checkEmailAvailable(control.value)),
        map((res) => (res.exists ? { emailTaken: true } : null))
      );
    };
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      userName: this.form.get('userName')?.value,
      email: this.form.get('email')?.value,
      firstName: this.form.get('firstName')?.value,
      lastName: this.form.get('lastName')?.value,
      gender: this.form.get('gender')?.value,
      dateOfBirth: this.form.get('dateOfBirth')?.value,
    };

    this.userService.editProfile(payload).subscribe({
      next: (res: any) => {
        if (res?.requireEmailConfirmation) {
          this.router.navigate(['confirm-change-email'], {
            queryParams: {
              userId: res.userId, // phải có dòng này
              email: res.email || payload.email,
              token: res.token,
              status: 'change',
            },
          });
        } else {
          this.successMessage = 'Update Successfully!';
          this.form.disable();
          this.close.emit();
          this.isFormDisabled = true;
        }
      },
      error: (err) => {
        alert('Update Failed, try again!');
      },
    });
  }
}
export function cannotClearIfHasValue(initialValue: any): ValidatorFn {
  return (control: AbstractControl) => {
    // Nếu ban đầu có dữ liệu, nhưng hiện tại lại bị xóa (rỗng/null)
    if (
      initialValue !== null &&
      initialValue !== '' &&
      (control.value === null || control.value === '')
    ) {
      return { cannotClear: true };
    }
    return null;
  };
}
