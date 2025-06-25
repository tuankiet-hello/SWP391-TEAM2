import { Component, Input, OnInit } from '@angular/core';
import { HeaderManagerComponent } from '../../header/header.component';
import { SidebarComponent } from '../../sidebar/sidebar.component';
// import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { FilterOutline } from '@ant-design/icons-angular/icons';
import { SearchOutline } from '@ant-design/icons-angular/icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentDTO, AppointmentService } from '../../../../services/appointment.service';
import { EditAppointmentComponent } from '../edit-appointment/edit-appointment.component';

@Component({
  selector: 'app-view-consultation-schedule',
  templateUrl: './view-consultation-schedule.component.html',
  styleUrl: './view-consultation-schedule.component.css',
  imports: [
    CommonModule,
    FormsModule,
    HeaderManagerComponent,
    SidebarComponent,
    NzModalModule,
    NzTableModule,
    NzInputModule,
    NzSelectModule,
    NzDropDownModule,
    NzIconModule,
    NzTagModule,
    NzDatePickerModule,
    EditAppointmentComponent
  ],
  providers: [
    { provide: NZ_ICONS, useValue: [FilterOutline, SearchOutline] }
  ]
})
export class ViewConsultationScheduleComponent implements OnInit {
  appointments: AppointmentDTO[] = [];
  filteredAppointments: AppointmentDTO[] = [];
  displayedAppointments: AppointmentDTO[] = [];
  selectedAppointment: AppointmentDTO | null = null;

  searchTerm = '';
  currentPage = 1;
  pageSize = 6;
  totalAppointments = 0;
  totalPages = 0;

  loading = false;
  selectedDate: Date | null = null;
  selectedWeek: Date | null = null;
  dateRange: Date[] = [];

  filterVisible = {
    fullName: false,
    email: false,
    status: false,
    appointmentDate: false
  };

  filter = {
    fullNameSort: '',
    emailSort: '',
    status: '',
    appointmentDateSort: ''
  };

  constructor(
    private appointmentService: AppointmentService,
    private modal: NzModalService,
    private message: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  handleCancel() {
    this.selectedAppointment = null;
  }

  // handleSave(updatedAppointment: AppointmentDTO) {
  //   this.appointmentService.updateAppointment(updatedAppointment).subscribe(() => {
  //     this.loadAppointments(); // reload appointments after update
  //     this.selectedAppointment = null; // đóng popup sau khi lưu
  //   });
  // }

  handleSave(updatedAppointment: AppointmentDTO) {
  this.appointmentService.updateAppointment(updatedAppointment).subscribe({
    next: () => {
      this.message.success('Update appointment success!');
      this.loadAppointments();
      this.selectedAppointment = null;
    },
    error: () => {
      this.message.error('Update appointment fail!');
    }
  });
}

  loadAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe((data) => {
      this.appointments = data;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    let filtered = [...this.appointments];

    // Search
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const search = this.searchTerm.trim().toLowerCase();
      filtered = filtered.filter(appt =>
        (appt.account.firstName + ' ' + appt.account.lastName).toLowerCase().includes(search) ||
        appt.account.email.toLowerCase().includes(search)
      );
    }

    // Filter status
    if (this.filter.status) {
      filtered = filtered.filter(appt => String(appt.status) === String(this.filter.status));
    }

    // Date filter (chỉ 1 loại filter ngày hoạt động)
      if (this.selectedDate) {
        const selected = this.toDateString(this.selectedDate);
        filtered = filtered.filter(appt => this.toDateString(appt.appointmentDate) === selected);
      } else if (this.selectedWeek) {
        const week = this.getISOWeek(this.selectedWeek);
        const year = this.selectedWeek.getFullYear();
        filtered = filtered.filter(appt => {
          const apptDate = new Date(appt.appointmentDate);
          return this.getISOWeek(apptDate) === week && apptDate.getFullYear() === year;
        });
      } else if (this.dateRange && this.dateRange.length === 2) {
        const [start, end] = this.dateRange.map(d => new Date(this.toDateString(d)));
        filtered = filtered.filter(appt => {
          const apptDate = new Date(this.toDateString(appt.appointmentDate));
          return apptDate >= start && apptDate <= end;
        });
      }

    // Sort full name
    if (this.filter.fullNameSort === 'az') {
      filtered = filtered.sort((a, b) =>
        (a.account.firstName + ' ' + a.account.lastName).localeCompare(b.account.firstName + ' ' + b.account.lastName)
      );
    } else if (this.filter.fullNameSort === 'za') {
      filtered = filtered.sort((a, b) =>
        (b.account.firstName + ' ' + b.account.lastName).localeCompare(a.account.firstName + ' ' + a.account.lastName)
      );
    }

    // Sort email
    if (this.filter.emailSort === 'az') {
      filtered = filtered.sort((a, b) => a.account.email.localeCompare(b.account.email));
    } else if (this.filter.emailSort === 'za') {
      filtered = filtered.sort((a, b) => b.account.email.localeCompare(a.account.email));
    }

    this.filteredAppointments = filtered;
    this.totalAppointments = this.filteredAppointments.length;
    this.totalPages = Math.ceil(this.totalAppointments / this.pageSize);
    this.currentPage = 1;
    this.updateDisplayedAppointments();
  }

  updateDisplayedAppointments(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedAppointments = this.filteredAppointments.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedAppointments();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedAppointments();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedAppointments();
    }
  }

  onDateChange(date: Date | null) {
    this.selectedDate = date;
    this.applyFilters();
  }

  onWeekChange(date: Date | null) {
    this.selectedWeek = date;
    this.applyFilters();
  }

  onRangeChange(range: Date[]) {
    this.dateRange = range;
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  // Hàm lấy số tuần ISO
  getISOWeek(date: Date): number {
    const tempDate = new Date(date.getTime());
    tempDate.setHours(0, 0, 0, 0);
    tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
    const week1 = new Date(tempDate.getFullYear(), 0, 4);
    return 1 + Math.round(((tempDate.getTime() - week1.getTime()) / 86400000
      - 3 + ((week1.getDay() + 6) % 7)) / 7);
  }

  // Helper: chuẩn hóa ngày về yyyy-MM-dd
  toDateString(date: Date | string): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().slice(0, 10);
  }

  // Chỉ cho phép 1 filter ngày hoạt động
  clearOtherDateFilters(type: 'date' | 'week' | 'range') {
    if (type === 'date') {
      this.selectedWeek = null;
      this.dateRange = [];
    } else if (type === 'week') {
      this.selectedDate = null;
      this.dateRange = [];
    } else if (type === 'range') {
      this.selectedDate = null;
      this.selectedWeek = null;
    }
  }

  clearDateFilters(): void {
    this.selectedDate = null;
    this.selectedWeek = null;
    this.dateRange = [];
    this.applyFilters();
    this.filterVisible.appointmentDate = false;
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

  setStatus(val: string) {
    this.filter.status = val;
    this.filterVisible.status = false;
    this.applyFilters();
  }

  openDateModal(type: 'date' | 'week' | 'range'): void {
    this.modal.create({
      nzTitle: `Select ${type === 'date' ? 'Date' : type === 'week' ? 'Week' : 'Date Range'}`,
      nzContent: DateModalContentComponent, // Component con chứa các picker tương ứng
      nzFooter: null,
      nzData: {
        type,
        selectedDate: this.selectedDate,
        selectedWeek: this.selectedWeek,
        dateRange: Array.isArray(this.dateRange) ? [...this.dateRange] : []
      }
    }).afterClose.subscribe(result => {
      if (result) {
        if (type === 'date') {
          this.selectedDate = result;
          this.selectedWeek = null;
          this.dateRange = [];
        } else if (type === 'week') {
          this.selectedWeek = result;
          this.selectedDate = null;
          this.dateRange = [];
        } else if (type === 'range') {
          this.dateRange = result;
          this.selectedDate = null;
          this.selectedWeek = null;
        }
        this.applyFilters();
      }
    });
  }

  openEditDialog(appointment: AppointmentDTO) {
    this.selectedAppointment = appointment;
  }

  editAppointment(appointment: AppointmentDTO) {
    this.selectedAppointment = appointment;
  }
}

@Component({
  selector: 'app-date-modal-content',
  template: `
    <ng-container [ngSwitch]="type">
      <nz-date-picker *ngSwitchCase="'date'" [(ngModel)]="selectedDate"></nz-date-picker>
      <nz-week-picker *ngSwitchCase="'week'" [(ngModel)]="selectedWeek"></nz-week-picker>
      <nz-range-picker *ngSwitchCase="'range'" [(ngModel)]="dateRange"></nz-range-picker>
    </ng-container>
    <div style="margin-top:16px; text-align:right;">
      <button nz-button nzType="default" (click)="close()">Huỷ</button>
      <button nz-button nzType="primary" [disabled]="!isValid()" (click)="ok()">OK</button>
    </div>
  `,
  imports: [
    // các module khác...
    FormsModule,
    CommonModule,
    NzDatePickerModule,
  ]
})
export class DateModalContentComponent {
  @Input() type: 'date' | 'week' | 'range' = 'date';
  @Input() selectedDate: Date | null = null;
  @Input() selectedWeek: Date | null = null;
  @Input() dateRange: Date[] = [];

  constructor(private modalRef: NzModalRef<DateModalContentComponent>) {}

  close() {
    this.modalRef.close(); // Đóng modal, không truyền data
  }

  ok() {
    if (this.type === 'date') {
      this.modalRef.close(this.selectedDate); // Truyền data về cha
    } else if (this.type === 'week') {
      this.modalRef.close(this.selectedWeek);
    } else if (this.type === 'range') {
      this.modalRef.close(this.dateRange && this.dateRange.length === 2 ? this.dateRange : []);
    }
  }

  isValid() {
    if (this.type === 'date') return !!this.selectedDate;
    if (this.type === 'week') return !!this.selectedWeek;
    if (this.type === 'range') return this.dateRange && this.dateRange.length === 2;
    return false;
  }
}
