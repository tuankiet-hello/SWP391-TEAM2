import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { HeaderManagerComponent } from '../../header/header.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { FilterOutline } from '@ant-design/icons-angular/icons';
import { SearchOutline } from '@ant-design/icons-angular/icons';
import {
  BookingService,
  EditTestBookingDTO,
  TestBookingDTO,
} from '../../../../services/test-booking.service';
import { ViewBookingDetailComponent } from '../view-booking-detail/view-booking-detail.component';
import { EditBookingComponent } from '../edit-booking/edit-booking.component';
import { CreateBookingComponent } from '../create-booking/create-booking.component';
@Component({
  selector: 'app-view-test-booking',
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
    NzDatePickerModule,
    ViewBookingDetailComponent,
    EditBookingComponent,
    CreateBookingComponent,
  ],
  providers: [{ provide: NZ_ICONS, useValue: [FilterOutline, SearchOutline] }],
  templateUrl: './view-test-booking.component.html',
  styleUrl: './view-test-booking.component.css',
})
export class ViewTestBookingComponent implements OnInit {
  emptyText = 'No test booking found';
  testBooking: TestBookingDTO[] = [];
  displayedTestBooking: TestBookingDTO[] = [];
  selectedBooking?: TestBookingDTO;
  isModalVisible: boolean = false;
  @Input() bookingID!: number;

  searchTerm: string = '';
  statusMap: { [key: number]: string } = {
    0: 'Submitted',
    1: 'Pending',
    2: 'Confirmed',
    3: 'Canceled',
    4: 'Completed',
  };
  statusColorMap: { [key: number]: string } = {
    0: '#1976d2',
    1: '#fbc02d',
    2: '#388e3c',
    3: '#d32f2f',
    4: '#7b1fa2',
  };

  filterVisible = {
    status: false,
    date: false,
  };

  filter = {
    status: '',
    date: null as Date | null,
  };

  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  modalType: 'booking' | null = null;

  constructor(
    private bookingService: BookingService,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadTestBooking();
  }

  loadTestBooking(): void {
    this.bookingService.getAllBookings().subscribe((data) => {
      this.testBooking = data;
      this.applyFilters(); // không preserve
    });
  }

  applyFilters(preservePage: boolean = false) {
    let filtered = [...this.testBooking];

    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const search = this.searchTerm.trim().toLowerCase();
      filtered = filtered.filter((booking) =>
        (booking.account.firstName + ' ' + booking.account.lastName)
          .toLowerCase()
          .includes(search)
      );
    }

    if (this.filter.status) {
      const statusValue = this.getStatusValue(this.filter.status);
      if (statusValue !== null) {
        filtered = filtered.filter((booking) => booking.status === statusValue);
      }
    }

    if (this.filter.date) {
      const selectedDate = new Date(this.filter.date);
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.bookingDate);
        return (
          bookingDate.getFullYear() === selectedDate.getFullYear() &&
          bookingDate.getMonth() === selectedDate.getMonth() &&
          bookingDate.getDate() === selectedDate.getDate()
        );
      });
    }

    this.totalPages = Math.ceil(filtered.length / this.pageSize);

    if (!preservePage) {
      this.currentPage = 1;
    } else {
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages || 1;
      }
    }

    this.updateDisplayedTestBooking(filtered);
  }

  setDate(date: Date | null) {
    this.filter.date = date;
    this.applyFilters();
  }

  private getStatusValue(statusString: string): number | null {
    const statusMap: { [key: string]: number } = {
      submitted: 0,
      pending: 1,
      confirmed: 2,
      canceled: 3,
      completed: 4,
    };
    return statusMap[statusString.toLowerCase()] ?? null;
  }

  setStatus(status: string) {
    this.filter.status = status;
    this.applyFilters();
  }

  updateDisplayedTestBooking(filtered: TestBookingDTO[] = this.testBooking) {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedTestBooking = filtered.slice(startIndex, endIndex);
  }

  viewBookingDetail(id: number): void {
    this.bookingService.getBookingById(id).subscribe((booking) => {
      this.selectedBooking = booking;
      this.isModalVisible = true;
    });
  }

  handleModalCancel(): void {
    this.isModalVisible = false;
    this.selectedBooking = undefined;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedTestBooking(this.getFilteredBookings());
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedTestBooking(this.getFilteredBookings());
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedTestBooking(this.getFilteredBookings());
    }
  }

  onSearchChange() {
    this.applyFilters();
  }

  getFilteredBookings(): TestBookingDTO[] {
    let filtered = [...this.testBooking];

    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const search = this.searchTerm.trim().toLowerCase();
      filtered = filtered.filter((booking) =>
        (booking.account.firstName + ' ' + booking.account.lastName)
          .toLowerCase()
          .includes(search)
      );
    }

    if (this.filter.status) {
      const statusValue = this.getStatusValue(this.filter.status);
      if (statusValue !== null) {
        filtered = filtered.filter((booking) => booking.status === statusValue);
      }
    }

    if (this.filter.date) {
      const selectedDate = new Date(this.filter.date);
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.bookingDate);
        return (
          bookingDate.getFullYear() === selectedDate.getFullYear() &&
          bookingDate.getMonth() === selectedDate.getMonth() &&
          bookingDate.getDate() === selectedDate.getDate()
        );
      });
    }

    return filtered;
  }

  isEditModalVisible = false;
  selectedEditBooking?: TestBookingDTO;
  idChoose?: number;

  editBooking(id: number) {
    this.selectedEditBooking = this.testBooking.find((b) => b.bookingID === id);
    this.idChoose = id ?? 0;
    this.isEditModalVisible = true;
  }

  handleEditModalClose() {
    this.isEditModalVisible = false;
    this.selectedEditBooking = undefined;
    this.idChoose = undefined;
  }

  handleBookingUpdated(updated: EditTestBookingDTO) {
    this.isEditModalVisible = false;
    this.selectedEditBooking = undefined;
    this.idChoose = undefined;

    this.bookingService.getAllBookings().subscribe((data) => {
      this.testBooking = data;
      this.applyFilters(true); // giữ nguyên currentPage sau update
      this.message.success('Booking updated successfully!');
    });
  }

  openBookingModal() {
    this.modalType = 'booking';
  }

  closeModal() {
    this.modalType = null;
  }
}
