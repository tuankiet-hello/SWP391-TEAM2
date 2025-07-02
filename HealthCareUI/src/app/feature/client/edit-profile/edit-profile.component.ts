import { HeaderComponent } from './../header/header.component';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './../../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { map, of, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  standalone: true,  // Bắt buộc phải có nếu dùng imports trong component
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  form!: FormGroup;
  originalEmail: string = '';
  originalUserName: string = '';
  successMessage: string = '';
  isFormDisabled: boolean = false;

  constructor(private fb: FormBuilder, private userService: AuthService) { }

  ngOnInit() {
    this.form = this.fb.group({
      userName: [{ value: '', disabled: false }, [Validators.required], [this.userNameAsyncValidator()]],
      email: [{ value: '', disabled: false }, [Validators.required, Validators.email], [this.emailAsyncValidator()]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
    });
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.form.patchValue({
          userName: data.userName,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.substring(0, 10) : ''
        });
        this.originalUserName = data.userName;
        this.originalEmail = data.email;

        // Đặt lại async validator sau khi đã có giá trị gốc
        this.form.get('userName')?.setAsyncValidators(this.userNameAsyncValidator());
        this.form.get('userName')?.updateValueAndValidity({ onlySelf: true });
        this.form.get('email')?.setAsyncValidators(this.emailAsyncValidator());
        this.form.get('email')?.updateValueAndValidity({ onlySelf: true });
      }
    });

  }
  userNameAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) return of(null);
      // Nếu giữ nguyên username cũ thì không check trùng
      if (control.value === this.originalUserName) return of(null);
      return timer(500).pipe(
        switchMap(() => this.userService.checkUserNameAvailable(control.value)),
        map(res => res.exists ? { userNameTaken: true } : null)
      );
    };
  }



  emailAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) return of(null);
      if (control.value === this.originalEmail) return of(null); // <-- thêm dòng này
      return timer(500).pipe(
        switchMap(() => this.userService.checkEmailAvailable(control.value)),
        map(res => res.exists ? { emailTaken: true } : null)
      );
    };
  }



  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Tạo payload chỉ lấy các trường có thể sửa
    const payload = {
      userName: this.form.get('userName')?.value,
      email: this.form.get('email')?.value,
      firstName: this.form.get('firstName')?.value,
      lastName: this.form.get('lastName')?.value,
      dateOfBirth: this.form.get('dateOfBirth')?.value,
    };

    this.userService.editProfile(payload).subscribe({
      next: () => {
          this.successMessage = 'Cập nhật thông tin thành công!';
            this.form.disable();            // <-- Khóa toàn bộ form
      this.isFormDisabled = true;     // <-- Để kiểm soát nút Save
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật profile:', err);
        alert('Cập nhật thất bại, vui lòng thử lại!');
      }
    });
  }
}
