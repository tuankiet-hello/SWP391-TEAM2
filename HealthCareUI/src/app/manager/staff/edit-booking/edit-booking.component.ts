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
import { NzMessageService } from 'ng-zorro-antd/message';
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
  @Input() accountID!: string;
  @Input() booking!: TestBookingDTO;
  @Input() bookingID!: number;
  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<EditTestBookingDTO>();

  form!: FormGroup;
  fb = inject(FormBuilder);
  tests: Test[] = [];

  constructor(
    private bookingService: BookingService,
    private message: NzMessageService,
    private testService: TestService // <- thêm dòng này
  ) {}

  ngOnInit() {
    // Lấy danh sách test từ service
    this.testService.getAllTests().subscribe((data) => {
      this.tests = data;
    });

    if (this.booking) {
      this.buildForm(); // 👈 Gọi sau khi booking có dữ liệu
      this.form.patchValue(this.booking);
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

  isDateTimeValid(): boolean {
    const formData = this.form.value;
    const selectedDate = new Date(`${formData.bookingDate}T${formData.bookingTime}`);

    // Nếu status là Confirmed và ngày giờ nhỏ hơn hiện tại → không hợp lệ
    if (Number(formData.status) === BookingStatus.Confirmed) {
      const now = new Date();
      return selectedDate >= now;
    }

    return true; // Các trạng thái khác thì luôn hợp lệ
  }


  submit() {
    if (this.form.invalid) return;

    // Nếu không có thay đổi, show message và return
    if (!this.isDataChanged()) {
      this.message.info('No changes detected!');
      return;
    }

    // Nếu trạng thái là Confirmed mà chọn thời gian trong quá khứ
    if (!this.isDateTimeValid()) {
      this.message.error('Cannot confirm booking for a past time!');
      return;
    }

    const formData = { ...this.form.value };
    const payload: EditTestBookingDTO = {
      testID: formData.testID,
      result: formData.result,
      bookingDate: formData.bookingDate,
      bookingTime: formData.bookingTime,
      status: Number(formData.status),
    };
    this.bookingService
      .editBooking(this.bookingID, this.accountID, payload)
      .subscribe({
        next: () => {
          this.message.success('Booking updated successfully!');
          this.updated.emit(payload);
          this.onCancel();
        },
        error: (err) => {
          this.message.error('Update failed. Please try again!');
          console.error('EditBooking error:', err.error?.errors || err);
        },
      });
  }

  isDataChanged(): boolean {
    if (!this.booking) return false;
    const formData = this.form.value;
    return (
      Number(this.booking.testID) !== Number(formData.testID) ||
      (this.booking.result || '').trim() !== (formData.result || '').trim() ||
      this.booking.bookingDate !== formData.bookingDate ||
      this.booking.bookingTime !== formData.bookingTime ||
      Number(this.booking.status) !== Number(formData.status)
    );
  }
}
