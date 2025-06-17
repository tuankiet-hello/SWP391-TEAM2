import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import {
  TeamOutline,
  UserOutline,
  MessageOutline,
  ClockCircleOutline,
  BarChartOutline
} from '@ant-design/icons-angular/icons';

import { CreateUserComponent } from '../manager-users/create-user/create-user.component';
import { CreateCustomerComponent } from '../manager-for-manager/create-customer/create-customer.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    CreateUserComponent,
    CreateCustomerComponent,
    NzIconModule,
    RouterModule
  ],
  providers: [
  { provide: NZ_ICONS, useValue: [
      TeamOutline,
      UserOutline,
      MessageOutline,
      ClockCircleOutline,
      BarChartOutline
    ]
  }
],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  modalType: 'user' | 'customer' | null = null;

  openUserModal() {
    this.modalType = 'user';
  }
  openCustomerModal() {
    this.modalType = 'customer';
  }
  closeModal() {
    this.modalType = null;
  }
}
