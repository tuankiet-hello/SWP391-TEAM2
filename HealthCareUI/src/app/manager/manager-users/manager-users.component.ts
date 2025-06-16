import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

import { NzModalModule} from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { FilterOutline } from '@ant-design/icons-angular/icons';
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
    NzSelectModule,
    NzDropDownModule,
    NzIconModule,
    // NzIconModule.forRoot([FilterOutline])
  ],
  providers: [
    { provide: NZ_ICONS, useValue: [FilterOutline] }
  ],
  templateUrl: './manager-users.component.html',
  styleUrl: './manager-users.component.css',
})
export class ManagerUsersComponent implements OnInit {
  emptyText = 'No users found';

  users: AccountTableDTO[] = []; // Dữ liệu gốc
  filteredUsers: AccountTableDTO[] = [];  // Dữ liệu đã filter/sort
  displayedUsers: AccountTableDTO[] = []; // Dữ liệu hiển thị trên trang

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
      this.applyFilters(); // Gọi filter luôn để cập nhật filteredUsers và phân trang
    });
  }

  updateDisplayedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedUsers = this.filteredUsers.slice(startIndex, endIndex);
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

  banUser(userId: string) {
    this.userService.banUser(userId).subscribe({
      next: () => {
        const user = this.users.find(u => u.id === userId);
        if (user) user.accountStatus = 'Inactive';
        this.applyFilters(); // Cập nhật lại filter và phân trang
      },
      error: (err) => console.error('Ban failed:', err)
    });
  }

  unbanUser(userId: string) {
    this.userService.unbanUser(userId).subscribe({
      next: () => {
        const user = this.users.find(u => u.id === userId);
        if (user) user.accountStatus = 'Active';
        this.applyFilters(); // Cập nhật lại filter và phân trang
      },
      error: (err) => console.error('Unban failed:', err)
    });
  }

  filterVisible = {
    fullName: false,
    email: false,
    role: false,
    emailConfirmed: false,
    status: false,
  };

  filter = {
    fullNameSort: '',
    emailSort: '',
    role: '',
    emailConfirmed: '',
    status: ''
  };

  applyFilters() {
    let filtered = [...this.users];

    // Filter Role
    if (this.filter.role) {
      filtered = filtered.filter(user => user.role === this.filter.role);
    }

    // Filter Email Confirmed
    if (this.filter.emailConfirmed) {
      filtered = filtered.filter(user =>
        this.filter.emailConfirmed === 'true' ? user.emailConfirmed : !user.emailConfirmed
      );
    }

    // Filter Status
    if (this.filter.status) {
      filtered = filtered.filter(user => user.accountStatus === this.filter.status);
    }

    // Sort Full Name
    if (this.filter.fullNameSort === 'az') {
      filtered = filtered.sort((a, b) => a.fullName.localeCompare(b.fullName));
    } else if (this.filter.fullNameSort === 'za') {
      filtered = filtered.sort((a, b) => b.fullName.localeCompare(a.fullName));
    }

    // Sort Email
    if (this.filter.emailSort === 'az') {
      filtered = filtered.sort((a, b) => a.email.localeCompare(b.email));
    } else if (this.filter.emailSort === 'za') {
      filtered = filtered.sort((a, b) => b.email.localeCompare(a.email));
    }

    this.filteredUsers = filtered;
    this.totalUsers = this.filteredUsers.length;
    this.totalPages = Math.ceil(this.totalUsers / this.pageSize);
    this.currentPage = 1; // Reset về trang 1 mỗi khi filter
    this.updateDisplayedUsers();
  }

  setFullNameSort(sort: string) {
    this.filter.fullNameSort = sort;
    this.filterVisible.fullName = false;
    this.applyFilters();
  }

  setEmailSort(sort: string) {
    this.filter.emailSort = sort;
    this.filterVisible.email = false;
    this.applyFilters();
  }

  setRole(role: string) {
    this.filter.role = role;
    this.filterVisible.role = false;
    this.applyFilters();
  }

  setEmailConfirmed(val: string) {
    this.filter.emailConfirmed = val;
    this.filterVisible.emailConfirmed = false;
    this.applyFilters();
  }

  setStatus(val: string) {
    this.filter.status = val;
    this.filterVisible.status = false;
    this.applyFilters();
  }
}
