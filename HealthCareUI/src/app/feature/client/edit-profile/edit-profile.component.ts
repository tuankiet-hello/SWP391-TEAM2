import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  imports: [CommonModule,
    ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
       firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
    });
  //   this.userService.getUserProfile().subscribe(data => {
  //   this.userName = data.userName;  // lưu riêng userName để hiển thị
  //   this.form.patchValue({
  //     firstName: data.firstName,
  //     lastName: data.lastName,
  //     dateOfBirth: data.dateOfBirth,
  //   });
  // });
  }
   submit() {
    if (this.form.valid) {
      console.log('Form data:', this.form.value);
      // Gửi dữ liệu lên server hoặc xử lý tiếp
    } else {
      this.form.markAllAsTouched();
    }
  }
  
}
