import { HeaderComponent } from './../header/header.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './../../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';

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

  constructor(private fb: FormBuilder, private userService: AuthService) {}

  ngOnInit() {
    this.form = this.fb.group({
      userName: [{ value: '', disabled: true }], // readonly, disabled để không sửa
      email: [{ value: '', disabled: true }],    // readonly, disabled
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
    });

    // Lấy dữ liệu user từ backend và gán vào form
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.form.patchValue({
          userName: data.userName,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.substring(0, 10) : '' // cắt chuỗi ngày nếu có thời gian
        });
      },
      error: (err) => {
        console.error('Lỗi khi lấy profile:', err);
      }
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Tạo payload chỉ lấy các trường có thể sửa
    const payload = {
      firstName: this.form.get('firstName')?.value,
      lastName: this.form.get('lastName')?.value,
      dateOfBirth: this.form.get('dateOfBirth')?.value,
    };

    this.userService.editProfile(payload).subscribe({
      next: () => {
        alert('Cập nhật thông tin thành công!');
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật profile:', err);
        alert('Cập nhật thất bại, vui lòng thử lại!');
      }
    });
  }
}
