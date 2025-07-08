import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import {
  TeamOutline,
  UserOutline,
  MessageOutline,
  ClockCircleOutline,
  BarChartOutline,
} from '@ant-design/icons-angular/icons';
import { Router } from '@angular/router';
import { CreateUserComponent } from '../manager-users/create-user/create-user.component';
import { CreateCustomerComponent } from '../manager-for-manager/create-customer/create-customer.component';
import { AuthService } from '../../../services/auth.service';
import { CreateBookingComponent } from '../staff/create-booking/create-booking.component';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    // CreateUserComponent,
    // CreateCustomerComponent,
    // CreateBookingComponent,
    NzIconModule,
    RouterModule,
  ],
  providers: [
    {
      provide: NZ_ICONS,
      useValue: [
        TeamOutline,
        UserOutline,
        MessageOutline,
        ClockCircleOutline,
        BarChartOutline,
      ],
    },
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  modalType: 'user' | 'customer' | 'booking' | null = null;
  role: string | null = null;
  @Output() testCreated = new EventEmitter<void>();
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    console.log('✅ SideBar ngOnInit called');
    this.role = this.authService.getRoleFromToken();
    console.log('🧑‍💼 role:', this.role);
  }
  handleTestCreated(): void {
    // Gọi API load lại danh sách
    this.testCreated.emit();
  }
  openUserModal() {
    this.modalType = 'user';
  }
  openCustomerModal() {
    this.modalType = 'customer';
  }
    openBookingModal() {
    this.modalType = 'booking';
  }
  closeModal() {
    this.modalType = null;
  }

}
