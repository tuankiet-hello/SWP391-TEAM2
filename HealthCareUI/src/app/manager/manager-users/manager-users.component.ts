import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

import { NzModalModule} from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import {
  AccountDetailDTO,
  AccountTableDTO,
  UserService,
} from '../../../services/manager-user.service';
import { UserViewComponent } from './user-view/user-view.component';

@Component({
  selector: 'app-manager-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    HeaderComponent,
    NzTableModule,
    NzInputModule,
    NzModalModule,
    UserViewComponent,
  ],
  templateUrl: './manager-users.component.html',
  styleUrl: './manager-users.component.css',
})
export class ManagerUsersComponent implements OnInit {
  emptyText = 'No users found';

  users: AccountTableDTO[] = [];
  displayedUsers: AccountTableDTO[] = [];

  selectedUser?: AccountDetailDTO;
  isModalVisible: boolean = false;

  // Phân trang
  currentPage = 1;
  pageSize = 6; // số user trên mỗi trang
  totalUsers = 0;
  totalPages = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe((data) => {
      this.users = data;
      this.totalUsers = this.users.length;
      this.totalPages = Math.ceil(this.totalUsers / this.pageSize);
      this.updateDisplayedUsers();
    });
  }

  updateDisplayedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedUsers = this.users.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedUsers();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedUsers();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedUsers();
    }
  }

  viewUserDetail(id: string): void {
    this.userService.getUserById(id).subscribe((user) => {
      this.selectedUser = user;
      this.isModalVisible = true;
    });
  }

  handleModalCancel(): void {
    this.isModalVisible = false;
    this.selectedUser = undefined;
  }

  toggleBanUser(user: AccountTableDTO) { // <--- Sửa thành AccountTableDTO
    if (user.accountStatus === 'Inactive') {
      this.unbanUser(user.id);
    } else {
      this.banUser(user.id);
    }
  }

  banUser(userId: string) { // <--- Sửa thành string
    this.userService.banUser(userId).subscribe({
      next: () => {
        const user = this.users.find(u => u.id === userId);
        if (user) user.accountStatus = 'Inactive';
        this.updateDisplayedUsers(); // Cập nhật lại UI
      },
      error: (err) => console.error('Ban failed:', err)
    });
  }

  unbanUser(userId: string) { // <--- Sửa thành string
    this.userService.unbanUser(userId).subscribe({
      next: () => {
        const user = this.users.find(u => u.id === userId);
        if (user) user.accountStatus = 'Active';
        this.updateDisplayedUsers(); // Cập nhật lại UI
      },
      error: (err) => console.error('Unban failed:', err)
    });
  }
}
