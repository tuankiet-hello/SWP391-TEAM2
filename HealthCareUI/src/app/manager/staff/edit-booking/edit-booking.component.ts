import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingService, EditTestBookingDTO, Test, TestBookingDTO } from '../../../../services/test-booking.service';
import { TestService } from '../../../../services/test.service';
import { NzMessageService } from 'ng-zorro-antd/message';
export enum BookingStatus {
  Submitted = 0,
  Pending = 1,
  Confirmed = 2,
  Canceled = 3,
  Completed = 4
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

  constructor(private bookingService: BookingService,
    private message: NzMessageService,
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
      status: Number(this.booking.status)
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

    // Nếu không có thay đổi, show message và return
    if (!this.isDataChanged()) {
      this.message.info('No changes detected!');
      return;
    }

    const formData = { ...this.form.value };
    const payload: EditTestBookingDTO = {
      testID: formData.testID,
      result: formData.result,
      bookingDate: formData.bookingDate,
      bookingTime: formData.bookingTime,
      status: Number(formData.status)
    };
    this.bookingService.editBooking(this.bookingID, payload).subscribe({
      next: () => {
        this.message.success('Booking updated successfully!'); // Thông báo thành công
        this.updated.emit(payload); // emit object đã sửa về cha
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
      (this.booking.result || '') !== (formData.result || '') ||
      this.booking.bookingDate !== formData.bookingDate ||
      this.booking.bookingTime !== formData.bookingTime ||
      Number(this.booking.status) !== Number(formData.status)
    );
  }

}
