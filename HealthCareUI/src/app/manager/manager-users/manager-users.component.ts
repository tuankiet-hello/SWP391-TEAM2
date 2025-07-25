import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderManagerComponent } from '../header/header.component';

import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { FilterOutline } from '@ant-design/icons-angular/icons';
import { SearchOutline } from '@ant-design/icons-angular/icons';
import {
  AccountDetailDTO,
  AccountTableDTO,
  UserService,
} from '../../../services/manager-user.service';
import { AuthService } from '../../../services/auth.service';
import { UserViewComponent } from './user-view/user-view.component';
import { UserEditComponent } from './edit-user/edit-user.component';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { CreateUserComponent } from './create-user/create-user.component';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';
@Component({
  selector: 'app-manager-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    HeaderManagerComponent,
    NzTableModule,
    NzInputModule,
    NzModalModule,
    UserViewComponent,
    UserEditComponent,
    NzSelectModule,
    NzDropDownModule,
    NzIconModule,
    NzTagModule,
    CreateUserComponent,
  ],
  providers: [{ provide: NZ_ICONS, useValue: [FilterOutline, SearchOutline] }],
  templateUrl: './manager-users.component.html',
  styleUrl: './manager-users.component.css',
})
export class ManagerUsersComponent implements OnInit {
  emptyText = 'No users found';

  users: AccountTableDTO[] = []; // Dữ liệu gốc
  filteredUsers: AccountTableDTO[] = []; // Dữ liệu đã filter/sort
  displayedUsers: AccountTableDTO[] = []; // Dữ liệu hiển thị trên trang

  selectedUser?: AccountDetailDTO;
  isModalVisible: boolean = false;

  selectedEditUser?: AccountDetailDTO;
  isEditModalVisible: boolean = false;
  idChoose: string = '';
  searchTerm: string = '';
  roleLogin!: string | null;

  // Phân trang
  currentPage = 1;
  pageSize = 5; // số user trên mỗi trang
  totalUsers = 0;
  totalPages = 0;
  modalType: 'user' | 'customer' | 'booking' | null = null;

  constructor(
    private userService: UserService,
    private modal: NzModalService,
    private message: NzMessageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.roleLogin = this.authService.getRoleFromToken();
    if (this.roleLogin != 'admin') {
      this.router.navigate(['/home']);
    } else {
      this.loadUsers();
    }
  }

  closeModal() {
    this.modalType = null;
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

  onSearchChange() {
    this.applyFilters();
  }

  viewUserDetail(id: string): void {
    this.userService.getUserById(id).subscribe((user) => {
      this.selectedUser = user;
      this.isModalVisible = true;
    });
  }
  openUserModal() {
    this.modalType = 'user';
  }
  editUser(id: string): void {
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.selectedEditUser = user;
        this.idChoose = id;
        this.isEditModalVisible = true;
        console.log('subid ', id);
      },
      error: (err) => console.error('Load user for edit failed', err),
    });
  }

  handleModalCancel(): void {
    this.isModalVisible = false;
    this.selectedUser = undefined;
  }

  handleEditModalClose(): void {
    this.isEditModalVisible = false;
    this.selectedEditUser = undefined;
  }

  handleUserUpdated(updatedUser: AccountDetailDTO) {
    const idx = this.users.findIndex((u) => u.id === this.idChoose);
    if (idx !== -1) {
      this.users[
        idx
      ].fullName = `${updatedUser.firstName} ${updatedUser.lastName}`;
      this.users[idx].email = updatedUser.email;
      this.users[idx].role = updatedUser.roles;
      this.users[idx].emailConfirmed = updatedUser.emailConfirmed;
      this.users[idx].accountStatus = updatedUser.accountStatus;
    }

    // Cập nhật filteredUsers theo filter hiện tại, nhưng KHÔNG reset currentPage
    this.filteredUsers = this.users.filter((user) => {
      // chỉ filter role, hoặc bổ sung các điều kiện filter khác nếu đang dùng
      let match = true;
      if (this.filter.role) {
        match = match && user.role === this.filter.role;
      }
      if (this.filter.status) {
        match = match && user.accountStatus === this.filter.status;
      }
      // bổ sung các filter khác nếu có
      return match;
    });

    // Cập nhật lại số lượng user và tổng số trang nếu cần
    this.totalUsers = this.filteredUsers.length;
    this.totalPages = Math.ceil(this.totalUsers / this.pageSize);

    // Nếu trang hiện tại không còn user nào mà không phải trang 1, thì lùi về trang trước
    const startIndex = (this.currentPage - 1) * this.pageSize;
    if (this.currentPage > 1 && startIndex >= this.totalUsers) {
      this.currentPage--;
    }

    // Cập nhật lại displayedUsers cho trang hiện tại
    this.updateDisplayedUsers();
    this.message.success('User updated successfully!');
    this.handleEditModalClose();
  }

  toggleBanUser(user: AccountTableDTO) {
    const isBan = user.accountStatus !== 'Inactive';
    const action = isBan ? 'Ban' : 'Unban';
    const confirmText = isBan
      ? 'Are you sure you want to ban this user?'
      : 'Are you sure you want to unban this user?';

    this.modal.confirm({
      nzTitle: `${action} user`,
      nzContent: confirmText,
      nzOkText: action,
      nzOkType: 'primary',
      nzOkDanger: isBan,
      nzOnOk: () => {
        if (isBan) {
          this.banUser(user.id);
        } else {
          this.unbanUser(user.id);
        }
      },
      nzCancelText: 'Cancel',
    });
  }

  banUser(userId: string) {
    this.userService.banUser(userId).subscribe({
      next: () => {
        const user = this.users.find((u) => u.id === userId);
        if (user) user.accountStatus = 'Inactive';

        // Cập nhật filteredUsers theo filter hiện tại, KHÔNG reset currentPage
        this.filteredUsers = this.users.filter((user) => {
          let match = true;
          if (this.filter.role) match = match && user.role === this.filter.role;
          if (this.filter.emailConfirmed)
            match =
              match &&
              (this.filter.emailConfirmed === 'true'
                ? user.emailConfirmed
                : !user.emailConfirmed);
          if (this.filter.status)
            match = match && user.accountStatus === this.filter.status;
          return match;
        });

        this.totalUsers = this.filteredUsers.length;
        this.totalPages = Math.ceil(this.totalUsers / this.pageSize);

        // Nếu trang hiện tại không còn user nào mà không phải trang 1, thì lùi về trang trước
        const startIndex = (this.currentPage - 1) * this.pageSize;
        if (this.currentPage > 1 && startIndex >= this.totalUsers) {
          this.currentPage--;
        }

        this.updateDisplayedUsers();
        this.message.success('User banned successfully!');
      },
      error: (err) => {
        this.message.error('Ban failed. Please try again!');
        console.error('Ban failed:', err);
      },
    });
  }

  unbanUser(userId: string) {
    this.userService.unbanUser(userId).subscribe({
      next: () => {
        const user = this.users.find((u) => u.id === userId);
        if (user) user.accountStatus = 'Active';

        // Cập nhật filteredUsers theo filter hiện tại, KHÔNG reset currentPage
        this.filteredUsers = this.users.filter((user) => {
          let match = true;
          if (this.filter.role) match = match && user.role === this.filter.role;
          if (this.filter.emailConfirmed)
            match =
              match &&
              (this.filter.emailConfirmed === 'true'
                ? user.emailConfirmed
                : !user.emailConfirmed);
          if (this.filter.status)
            match = match && user.accountStatus === this.filter.status;
          return match;
        });

        this.totalUsers = this.filteredUsers.length;
        this.totalPages = Math.ceil(this.totalUsers / this.pageSize);

        // Nếu trang hiện tại không còn user nào mà không phải trang 1, thì lùi về trang trước
        const startIndex = (this.currentPage - 1) * this.pageSize;
        if (this.currentPage > 1 && startIndex >= this.totalUsers) {
          this.currentPage--;
        }

        this.updateDisplayedUsers();
        this.message.success('User unbanned successfully!');
      },
      error: (err) => {
        this.message.error('Unban failed. Please try again!');
        console.error('Unban failed:', err);
      },
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
    status: '',
  };

  applyFilters() {
    let filtered = [...this.users];

    // Search theo tên hoặc email
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const search = this.searchTerm.trim().toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.fullName.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search)
      );
    }

    // Filter Role
    if (this.filter.role) {
      filtered = filtered.filter((user) => user.role === this.filter.role);
    }

    // Filter Email Confirmed
    if (this.filter.emailConfirmed) {
      filtered = filtered.filter((user) =>
        this.filter.emailConfirmed === 'true'
          ? user.emailConfirmed
          : !user.emailConfirmed
      );
    }

    // Filter Status
    if (this.filter.status) {
      filtered = filtered.filter(
        (user) => user.accountStatus === this.filter.status
      );
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
