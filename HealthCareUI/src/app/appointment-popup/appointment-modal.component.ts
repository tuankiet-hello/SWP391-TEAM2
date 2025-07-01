import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
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
export class AppointmentModalComponent implements OnChanges {
  @Input() show!: boolean;
  @Input() imageUrl = '';
  @Input() title = '';
  @Input() description = '';
  @Input() price: number = 0;
  @Input() active!: boolean;
  @Input() firstName = '';
  @Input() lastName = '';
  @Input() email = '';
  @Input() dateOfBirth = '';

  @Output() close = new EventEmitter<void>();

  form: FormGroup;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.form) {
      this.form.patchValue({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        dateOfBirth: this.dateOfBirth,
      });

      // set các trường là readonly bằng cách disable
    }
  }

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      type: ['', Validators.required],
      bookingDate: ['', Validators.required],
      bookingTime: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
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
