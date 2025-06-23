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
import { ManagerService, Tests } from '../../../../services/manager.service';
import { AuthService } from '../../../../services/auth.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { TestDTO, TestService } from '../../../../services/test.service';
import { TestEditComponent } from './edit-test-service/edit-test.component';
@Component({
  selector: 'app-manage-service',
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

  currentPage = 1;
  pageSize = 5; // số user trên mỗi trang
  totalUsers = 0;
  totalPages = 0;
  @Output() ban = new EventEmitter<void>();
  constructor(
    private authService: AuthService,
    private managerService: ManagerService,
    private fb: FormBuilder,
    private testService: TestService
  ) {}

  tests: Tests[] = [];
  displayedTest: Tests[] = [];
  loadTests(): void {
    this.managerService.getAllListTest().subscribe({
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
    // Gọi API load lại danh sách
    this.loadTests();
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
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedTest = this.tests.slice(startIndex, endIndex);
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
}
