import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TestBookingDTO } from '../../../../services/test-booking.service';

@Component({
  selector: 'app-view-booking-detail',
  imports: [CommonModule],
  standalone:true,
  templateUrl: './view-booking-detail.component.html',
  styleUrl: './view-booking-detail.component.css'
})
export class ViewBookingDetailComponent {
@Input() booking!: TestBookingDTO;
@Output() close = new EventEmitter<void>();
  statusMap: { [key: number]: string } = {
  0: 'Đã gửi',
  1: 'Đang chờ duyệt',
  2: 'Đã xác nhận',
  3: 'Đã hủy',
  4: 'Hoàn thành'
};
statusColorMap: { [key: number]: string } = {
  0: '#1976d2',
  1: '#fbc02d',
  2: '#388e3c',
  3: '#d32f2f',
  4: '#7b1fa2'
};

onClose() { this.close.emit(); }


}
