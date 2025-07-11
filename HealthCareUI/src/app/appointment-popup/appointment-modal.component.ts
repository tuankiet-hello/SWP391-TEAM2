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
  AbstractControl, ValidationErrors
} from '@angular/forms';
import { BookingService } from '../../services/test-booking.service';
import { AuthService } from '../../services/auth.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
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
  @Input() testID!: number; // ID của test để đặt lịch

  @Output() close = new EventEmitter<void>();
  todayString: string = new Date().toISOString().split('T')[0];
  isSubmitting = false;
  form: FormGroup;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.form) {
      this.form.patchValue({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        dateOfBirth: this.dateOfBirth,
      });
    }
  }

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private authService: AuthService,
    private notification: NzNotificationService
  ) {
    this.form = this.fb.group(
  {
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    bookingDate: ['', [Validators.required, this.bookingDateValidator]],
    bookingTime: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
  },
  { validators: this.bookingTimeValidator }
);
  }

bookingTimeValidator(form: FormGroup): ValidationErrors | null {
  const date = form.get('bookingDate')?.value;
  const time = form.get('bookingTime')?.value;

  if (!date || !time) return null;

  const now = new Date();
  const selected = new Date(`${date}T${time}`);

  // Nếu ngày là hôm nay và giờ nhỏ hơn hiện tại
  if (date === now.toISOString().split('T')[0] && selected < now) {
    return { pastTimeToday: true };
  }

  return null;
}

  bookingDateValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // reset giờ

    if (selectedDate < today) {
      return { pastDate: true };
    }

    return null;
  }

  getTodayAsNumber(): number {
    const today = new Date();
    return (
      today.getFullYear() * 10000 +
      (today.getMonth() + 1) * 100 +
      today.getDate()
    );
  }

  onClose() {
    this.close.emit();
  }

  onSubmit(): void {
    console.log('👉 onSubmit called');

    if (!this.isFormValid()) return;
this.isSubmitting = true;
    const formData = this.form.value;

    if (!this.isBookingDateValid(formData.bookingDate)) {
      this.showNotification(
        'error',
        'Invalid Booking Date',
        'The booking date cannot be in the past.'
      );
      return;
    }

    const accountID = this.authService.getIdFromToken();
    if (!accountID) {
      this.showNotification(
        'error',
        'Authentication Error',
        'Unable to identify user. Please log in again.'
      );
      return;
    }

    const payload = this.buildPayload(formData, accountID);

    this.bookingService.createBookingForUser(payload).subscribe({
      next: () => {
        console.log('✅ Booking created!', payload);
        this.showNotification(
          'success',
          'Booking Success',
          'Your appointment has been successfully scheduled.'
        );
        this.isSubmitting = false;
        this.close.emit();
      },
      error: (err) => {
        console.error('❌ Booking error:', err);
        this.showNotification(
          'error',
          'Booking Failed',
          'An error occurred while booking. Please try again.'
        );
        this.isSubmitting = false;
      },
    });
  }

  // 🧩 Check form validity
  private isFormValid(): boolean {
    if (this.form.invalid) {
      this.showNotification(
        'error',
        'Validation Error',
        'Please fill out all required fields correctly.'
      );
      return false;
    }
    return true;
  }

  // 🧩 Check if bookingDate is today or future
  private isBookingDateValid(dateStr: string): boolean {
    const bookingDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // reset giờ để so sánh
    return bookingDate >= today;
  }

  // 🧩 Show notification
  private showNotification(
    type: 'success' | 'error',
    title: string,
    message: string
  ): void {
    this.notification.create(type, title, message, {
      nzPlacement: 'topRight',
      nzDuration: 3000,
      nzStyle: { top: '80px' },
    });
  }

  // 🧩 Build payload object
  private buildPayload(formData: any, accountID: string) {
    return {
      accountID: accountID,
      testID: this.testID,
      result: '',
      bookingDate: formData.bookingDate,
      bookingTime: formData.bookingTime,
      status: 0, // Submitted
    };
  }
}
