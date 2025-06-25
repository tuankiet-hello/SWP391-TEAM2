import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  TestBookingDTO,
  BookingService,
} from '../../../../services/test-booking.service';
@Component({
  selector: 'app-view-booking-detail',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './view-booking-detail.component.html',
  styleUrl: './view-booking-detail.component.css',
})
export class ViewBookingDetailComponent {
  @Input() booking!: TestBookingDTO;
  @Input() bookingID!: number;
  @Output() close = new EventEmitter<void>();
  statusMap: { [key: number]: string } = {
    0: 'Submitted',
    1: 'Pending',
    2: 'Confirmed',
    3: 'Canceled',
    4: 'Completed',
  };
  statusColorMap: { [key: number]: string } = {
    0: '#1976d2',
    1: '#fbc02d',
    2: '#388e3c',
    3: '#d32f2f',
    4: '#a73cd4',
  };
  constructor(private bookingService: BookingService) {}

  onClose() {
    this.close.emit();
  }
}
