import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TestBookingDTO } from '../../../../services/test-booking.service';
import { AuthService } from '../../../../services/auth.service';
@Component({
  selector: 'app-view-booking-detail',
  imports: [CommonModule],
  standalone:true,
  templateUrl: './view-booking-detail.component.html',
  styleUrl: './view-booking-detail.component.css'
})
export class ViewBookingDetailComponent implements OnInit {
@Input() booking!: TestBookingDTO;
 
@Output() close = new EventEmitter<void>();
  role!: string | null;
constructor(private authService: AuthService){}


  ngOnInit(): void {
    this.role = this.authService.getRoleFromToken();
  }
  statusMap: { [key: number]: string } = {
  0: 'Submitted',
  1: 'Pending',
  2: 'Confirmed',
  3: 'Canceled',
  4: 'Completed'
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
