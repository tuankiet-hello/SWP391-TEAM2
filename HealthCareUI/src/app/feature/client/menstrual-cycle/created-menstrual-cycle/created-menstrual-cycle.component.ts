import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MenstrualCycleDTO,
  MenstrualService,
} from '../../../../../services/menstrual-cycle.service';
import { UserService } from '../../../../../services/manager-user.service';
import { AuthService } from '../../../../../services/auth.service';
export interface MenstrualCycle {
  start_date: string; // ISO date string yyyy-MM-dd
  end_date: string;
  note?: string;
}

@Component({
  selector: 'app-created-menstrual-cycle',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './created-menstrual-cycle.component.html',
  styleUrls: ['./created-menstrual-cycle.component.css'], // Sửa thành styleUrls
})
export class CreatedMenstrualCycleComponent {
  // @Output() save = new EventEmitter<MenstrualCycleDTO>();
  @Output() cancel = new EventEmitter<void>();
  @Input() selectmode!: string;
  @Input() cycle!: MenstrualCycleDTO;
  @Output() success = new EventEmitter<void>();

  role!: string | null;
  createMenstrualForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private menstrualService: MenstrualService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRoleFromToken();
    console.log('🧑‍💼 role:', this.role);
    this.createMenstrualForm = this.fb.group({
      accountID: ['', [Validators.required]],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required], // disabled, không validator
      note: [''],
      reminder_enabled: [true],
    });

    if (this.selectmode === 'edit' && this.cycle) {
      console.log('🛠 Patch dữ liệu form:', this.cycle);
      this.createMenstrualForm.patchValue(this.cycle);
    }
  }

  onSubmit() {
    const accountId = this.authService.getIdFromToken();
    if (!accountId) {
      alert('Không tìm thấy tài khoản, vui lòng đăng nhập lại.');
      return;
    }
    this.createMenstrualForm.patchValue({
      accountID: accountId,
    });
    const formValue = this.createMenstrualForm.value;
    const cycle: MenstrualCycleDTO = {
      ...formValue,
    };
    console.log('📤 Dữ liệu gửi:', cycle);
    this.menstrualService.createCycle(cycle).subscribe({
      next: (res) => {
        console.log('✅ Thành công tạo chu kỳ');
        if (cycle.reminder_enabled) {
        }
        this.success.emit();
        this.cancel.emit();
      },
      error: (err) => {
        console.error('❌ Lỗi khi tạo chu kỳ:', err);
        alert('Tạo chu kỳ thất bại, vui lòng thử lại.');
      },
    });
  }

  onEdit() {
    const accountId = this.authService.getIdFromToken();
    if (!accountId) {
      alert('Không tìm thấy tài khoản, vui lòng đăng nhập lại.');
      return;
    }
    const formValue = this.createMenstrualForm.value;
    const cycle: MenstrualCycleDTO = {
      ...formValue,
    };
    console.log('📤 Dữ liệu gửi:', cycle);
    this.menstrualService.editCycle(this.cycle.cycleID, cycle).subscribe({
      next: (res) => {
        console.log('✅ Thành công sửa chu kỳ');
        this.success.emit();
        this.cancel.emit();
      },
      error: (err) => {
        console.error('❌ Lỗi khi sửa chu kỳ:', err);
        alert('sửa chu kỳ thất bại, vui lòng thử lại.');
      },
    });
  }
  onCancel() {
    this.cancel.emit();
  }
}
