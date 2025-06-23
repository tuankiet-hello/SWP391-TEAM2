import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  createTestForm: FormGroup;
  isEdit = false;

  currentPage = 1;
  pageSize = 5; // số user trên mỗi trang
  totalUsers = 0;
  totalPages = 0;

  constructor(
    private authService: AuthService,
    private managerService: ManagerService,
    private fb: FormBuilder
  ) {
    this.createTestForm = this.fb.group({
      TestName: ['', Validators.required],
      Price: ['', [Validators.required]],
      Description: ['', [Validators.required]],
      Status: [0],
    });
  }

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

  BanTest(index: number): void {
    this.tests[index].active = !this.tests[index].active;
    this.loadTests();
  }
  onAddTest(): void {
    // if (this.addTestForm.invalid) {
    //   this.addTestForm.markAllAsTouched();
    //   return;
    // }

    const payload = this.createTestForm.value;
    this.managerService.addTest(payload).subscribe({
      next: () => {
        alert('✅ Thêm test thành công!');
        this.createTestForm.reset({ Active: true }); // reset form
        this.loadTests(); // load lại danh sách
      },
      error: (err) => {
        console.error('❌ Lỗi khi thêm test:', err);
        alert('❌ Không thể thêm test. Kiểm tra lại!');
      },
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

  ngOnInit(): void {
    console.log('✅ Sexual Testing ngOnInit called');
    this.isLoggedIn = this.authService.isLoggedIn();
    this.role = this.authService.getRoleFromToken();
    console.log('🔐 isLoggedIn:', this.isLoggedIn);
    console.log('🧑‍💼 role:', this.role);

    this.loadTests();
  }
}
