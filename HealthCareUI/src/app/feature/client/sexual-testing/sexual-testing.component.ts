import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentCardComponent } from '../../../../app/shared/components/appointment-card/appointment-card.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../../../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { AppointmentModalComponent } from '../../../appointment-popup/appointment-modal.component';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { TestDTO, TestService } from '../../../../services/test.service';
@Component({
  selector: 'app-sexual-testing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AppointmentCardComponent,
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule,
    AppointmentModalComponent,
  ],
  templateUrl: './sexual-testing.component.html',
  styleUrls: ['./sexual-testing.component.css'],
})
export class SexualTestingComponent {
  search: string = '';
  role: string | null = null;
  isLoggedIn = false;
  userName: string | null = null;
  createTestForm: FormGroup;
  isEdit = false;
  showModal = false;
  selectedTest!: TestDTO;
  constructor(
    private authService: AuthService,
    private testService: TestService,
    private fb: FormBuilder
  ) {
    this.createTestForm = this.fb.group({
      TestName: ['', Validators.required],
      Price: ['', [Validators.required]],
      Description: ['', [Validators.required]],
      Status: [0],
    });
  }

  tests: TestDTO[] = [];

  loadTests(): void {
    this.testService.getAllListTest().subscribe({
      next: (data) => {
        this.tests = data;
        console.log('🧪 Loaded tests from API:', this.tests);
      },
      error: (err) => {
        console.error('❌ Failed to load tests', err);
      },
    });
  }

  onAddTest(): void {
    // if (this.addTestForm.invalid) {
    //   this.addTestForm.markAllAsTouched();
    //   return;
    // }

    const payload = this.createTestForm.value;
    this.testService.addTest(payload).subscribe({
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

  ngOnInit(): void {
    console.log('✅ Sexual Testing ngOnInit called');
    this.isLoggedIn = this.authService.isLoggedIn();
    this.role = this.authService.getRoleFromToken();
    console.log('🔐 isLoggedIn:', this.isLoggedIn);
    console.log('🧑‍💼 role:', this.role);

    this.loadTests();
  }

  get filteredTests() {
    return this.tests.filter((t) =>
      t.testName.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  closePopup(): void {
    this.showModal = false;
  }

  openBookingPopup(id: number): void {
    this.testService.getTestById(id).subscribe({
      next: (data) => {
        this.selectedTest = data;
        this.showModal = true;
        console.log('đã nạp data', this.selectedTest);
      },
    });
  }
}
