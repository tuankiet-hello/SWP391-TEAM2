import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-appointment-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appointment-modal.component.html',
  styleUrls: ['./appointment-modal.component.css'],
})
export class AppointmentModalComponent {
  @Input() show!: boolean;
  @Input() imageUrl = '';
  @Input() title = '';
  @Input() description = '';
  @Input() price: number = 0;
  @Input() active!: boolean;

  @Output() close = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      type: ['', Validators.required],
    });
  }
  onClose() {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    console.log('✅ Gửi dữ liệu:', this.form.value);
    alert('📬 Đặt lịch thành công!');
    this.close.emit();
  }
}
