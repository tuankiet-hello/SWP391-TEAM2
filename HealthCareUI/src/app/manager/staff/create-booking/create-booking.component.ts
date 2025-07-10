import {
  AccountTableDTO,
  UserService,
} from './../../../../services/manager-user.service';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  Account,
  BookingService,
  CreateTestBookingDTO,
  EditTestBookingDTO,
  Test,
  TestBookingDTO,
} from '../../../../services/test-booking.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TestService } from '../../../../services/test.service';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';

@Component({
  selector: 'app-create-booking',
  imports: [ReactiveFormsModule, CommonModule, NzDatePickerModule, NzTimePickerModule],
  templateUrl: './create-booking.component.html',
  styleUrl: './create-booking.component.css',
})
export class CreateBookingComponent implements OnInit {
  @Input() booking!: TestBookingDTO;
  @Input() bookingID!: number;
  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<EditTestBookingDTO>();

  form!: FormGroup;
  fb = inject(FormBuilder);
  tests: Test[] = [];
  users: AccountTableDTO[] = [];
  successMessage = '';
  isSubmitting = false;

  constructor(
    private bookingService: BookingService,
    private message: NzMessageService,
    private testService: TestService,
    private userService: UserService // <- thêm dòng này
  ) {}

  disabledDate = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current && current < today;
  };

  ngOnInit() {
    this.buildForm();
    //Lấy danh sách test từ service
    this.testService.getAllTests().subscribe((data) => {
      this.tests = data;
    });
    this.userService.getAllUsers().subscribe((data) => {
      this.users = data;
    });
    // if (this.booking) {
    //   this.form.patchValue(this.booking);
    //   status: Number(this.booking.status)
    // }
  }

  buildForm() {
  this.form = this.fb.group({
    accountID: [null, Validators.required],
    testID: [null, Validators.required],
    result: [''],
    bookingDate: [null, Validators.required],  // <- Để null thay vì ''
    bookingTime: [null, Validators.required],  // <- Để null thay vì ''
    status: [2, Validators.required],
  });
}

  onCancel() {
    this.close.emit();
  }

  submit() {
  if (this.form.invalid) return;
  const formData = this.form.value;

  const date = new Date(formData.bookingDate);
  const time = new Date(formData.bookingTime);

  // format date: yyyy-MM-dd
  const formattedDate = date.toISOString().split('T')[0];

  // format time: HH:mm
  const formattedTime = time.toTimeString().slice(0, 5);

  const payload: CreateTestBookingDTO = {
    accountID: formData.accountID,
    testID: formData.testID,
    result: formData.result,
    bookingDate: formattedDate,
    bookingTime: formattedTime,
    status: Number(formData.status),
  };

  this.bookingService.addBooking(payload).subscribe({
    next: () => {
      this.message.success('Booking created successfully!');
      this.updated.emit(payload);
      setTimeout(() => {
        this.close.emit();
        window.location.reload();
      }, 1000);
    },
    error: (err) => {
      this.message.error('Failed to create booking. Please try again!');
      console.error('Create Booking error:', err.error?.errors || err);
    },
  });
}

}
