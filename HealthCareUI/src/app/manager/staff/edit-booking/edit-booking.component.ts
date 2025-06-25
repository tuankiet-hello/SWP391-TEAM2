import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  BookingService,
  EditTestBookingDTO,
  Test,
  TestBookingDTO,
} from '../../../../services/test-booking.service';
import { TestService } from '../../../../services/test.service';
export enum BookingStatus {
  Submitted = 0,
  Pending = 1,
  Confirmed = 2,
  Canceled = 3,
  Completed = 4,
}
@Component({
  selector: 'app-edit-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-booking.component.html',
  styleUrls: ['./edit-booking.component.css'],
})
export class EditBookingComponent implements OnInit {
  @Input() booking!: TestBookingDTO;
  @Input() bookingID!: number;
  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<EditTestBookingDTO>();

  form!: FormGroup;
  fb = inject(FormBuilder);
  tests: Test[] = [];

  constructor(
    private bookingService: BookingService,
    private testService: TestService // <- thêm dòng này
  ) {}

  ngOnInit() {
    this.buildForm();
    //Lấy danh sách test từ service
    this.testService.getAllTests().subscribe((data) => {
      this.tests = data;
    });
    if (this.booking) {
      this.form.patchValue(this.booking);
      status: Number(this.booking.status);
    }
  }

  buildForm() {
    this.form = this.fb.group({
      testID: ['', Validators.required],
      result: [''],
      bookingDate: ['', Validators.required],
      bookingTime: ['', Validators.required],
      status: [this.booking?.status ?? 0, Validators.required],
    });
  }

  onCancel() {
    this.close.emit();
  }

  submit() {
    if (this.form.invalid) return;
    const formData = { ...this.form.value };
    const payload: EditTestBookingDTO = {
      testID: formData.testID,
      result: formData.result,
      bookingDate: formData.bookingDate,
      bookingTime: formData.bookingTime,
      status: Number(this.form.value.status),
    };
    this.bookingService.editBooking(this.bookingID, payload).subscribe({
      next: () => {
        this.updated.emit(payload); // emit object đã sửa về cha
      },
      error: (err) => {
        console.error('EditBooking error:', err.error?.errors || err);
      },
    });
  }
}
