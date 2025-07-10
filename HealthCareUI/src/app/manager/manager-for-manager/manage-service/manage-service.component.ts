import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { HeaderManagerComponent } from '../../header/header.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from '../../../../services/auth.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { TestDTO, TestService } from '../../../../services/test.service';
import { TestEditComponent } from './edit-test-service/edit-test.component';
import { CreateCustomerComponent } from '../../manager-for-manager/create-customer/create-customer.component';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-manage-service',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    HeaderManagerComponent,
    NzTableModule,
    NzInputModule,
    NzModalModule,
    NzSelectModule,
    NzDropDownModule,
    NzIconModule,
    ReactiveFormsModule,
    TestEditComponent,
    CreateCustomerComponent,
    NzTagModule,
  ],
  providers: [],
  templateUrl: './manage-service.component.html',
  styleUrl: './manage-service.component.css',
})
export class ManageServiceComponent {
  search: string = '';
  role: string | null = null;
  isLoggedIn = false;
  userName: string | null = null;
  isEdit = false;
  selectedEditTest?: TestDTO;
  isEditModalVisible: boolean = false;
  idChoose: number = 0;
  modalType: 'user' | 'customer' | 'booking' | null = null;
  currentPage = 1;
  pageSize = 5; // số user trên mỗi trang
  totalUsers = 0;
  totalPages = 0;
  @Output() ban = new EventEmitter<void>();
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private testService: TestService,
    private message: NzMessageService
  ) {}

  tests: TestDTO[] = [];
  displayedTest: TestDTO[] = [];

  filterVisible = {
    testName: false,
    description: false,
    status: false,
  };

  filter = {
    testName: null as 'asc' | 'desc' | null,
    description: null as 'asc' | 'desc' | null,
    status: null as 'active' | 'inactive' | null,
  };

  loadTests(): void {
    this.testService.getAllListTest().subscribe({
      next: (data) => {
        this.tests = data;
        this.totalUsers = this.tests.length;
        this.totalPages = Math.ceil(this.totalUsers / this.pageSize);
        this.currentPage = 1;
        this.updateDisplayedUsers();
        console.log('🧪 Loaded tests from API:', this.tests);
      },
      error: (err) => {
        console.error('❌ Failed to load tests', err);
      },
    });
  }
  handleTestCreated(): void {
    this.loadTests();
    if (this.search.trim() !== '') {
      this.onSearchChange();
    }
    this.message.success('Created new test successfully');
  }

  handleEditSuccess(): void {
    this.loadTests();
    this.message.success('Test updated successfully!');
  }

  editTest(id: number): void {
    this.testService.getTestById(id).subscribe({
      next: (user) => {
        this.selectedEditTest = user;
        this.isEditModalVisible = true;
      },
      error: (err) => console.error('Load test for edit failed', err),
    });
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
  updateDisplayedUsers(): void {
    let filtered = [...this.tests];

    // Filter theo search
    if (this.search.trim()) {
      const searchLower = this.search.trim().toLowerCase();
      filtered = filtered.filter(
        (test) =>
          test.testName?.toLowerCase().includes(searchLower) ||
          '' ||
          test.description?.toLowerCase().includes(searchLower) ||
          ''
      );
    }

    // Filter theo status
    if (this.filter.status !== null) {
      filtered = filtered.filter((test) =>
        this.filter.status === 'active'
          ? test.active === true
          : test.active === false
      );
    }

    // Sort theo testName
    if (this.filter.testName) {
      filtered.sort((a, b) => {
        const aVal = a.testName?.toLowerCase() || '';
        const bVal = b.testName?.toLowerCase() || '';
        return this.filter.testName === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });
    }

    // Sort theo description
    if (this.filter.description) {
      filtered.sort((a, b) => {
        const aVal = a.description?.toLowerCase() || '';
        const bVal = b.description?.toLowerCase() || '';
        return this.filter.description === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });
    }

    // Tính paging
    this.totalUsers = filtered.length;
    this.totalPages = Math.ceil(this.totalUsers / this.pageSize);

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedTest = filtered.slice(startIndex, endIndex);
  }

  handleEditModalClose(): void {
    this.isEditModalVisible = false;
    this.selectedEditTest = undefined;
  }
  ngOnInit(): void {
    console.log('✅ Sexual Testing ngOnInit called');
    this.isLoggedIn = this.authService.isLoggedIn();
    this.role = this.authService.getRoleFromToken();
    console.log('🔐 isLoggedIn:', this.isLoggedIn);
    console.log('🧑‍💼 role:', this.role);

    this.loadTests();
  }

  openCustomerModal() {
    this.modalType = 'customer';
  }
  closeModal() {
    this.modalType = null;
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.updateDisplayedUsers();
  }

  sortTestName(order: 'asc' | 'desc' | null) {
    this.filter.testName = order;
    this.filterVisible.testName = false;
    this.currentPage = 1;
    this.updateDisplayedUsers();
  }

  sortDescription(order: 'asc' | 'desc' | null) {
    this.filter.description = order;
    this.filterVisible.description = false;
    this.currentPage = 1;
    this.updateDisplayedUsers();
  }

  filterStatus(status: 'active' | 'inactive' | null) {
    this.filter.status = status;
    this.filterVisible.status = false;
    this.currentPage = 1;
    this.updateDisplayedUsers();
  }
}
