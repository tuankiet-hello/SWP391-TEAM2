import { Component, OnInit } from '@angular/core';
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
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { FilterOutline } from '@ant-design/icons-angular/icons';
import { SearchOutline } from '@ant-design/icons-angular/icons';
import {
  BookingService,
  TestBookingDTO,
} from '../../../../services/test-booking.service';

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
  ],
  providers: [{ provide: NZ_ICONS, useValue: [FilterOutline, SearchOutline] }],
  templateUrl: './view-test-booking.component.html',
  styleUrl: './view-test-booking.component.css',
})
export class ViewTestBookingComponent implements OnInit {
  emptyText = 'No test booking found';

  testBooking: TestBookingDTO[] = [];
  displayedTestBooking: TestBookingDTO[] = [];
  searchTerm: string = '';

  // Pagination
  currentPage = 1;
  pageSize = 6;
  totalPages = 0;

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
      this.applyFilters();
    });
  }

  applyFilters() {
    let filtered = [...this.testBooking];

    // Search by user name
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const search = this.searchTerm.trim().toLowerCase();
      filtered = filtered.filter((booking) =>
        (booking.account.firstName + ' ' + booking.account.lastName)
          .toLowerCase()
          .includes(search)
      );
    }

    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    this.currentPage = 1;
    this.updateDisplayedTestBooking(filtered);
  }

  updateDisplayedTestBooking(filtered: TestBookingDTO[] = this.testBooking) {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedTestBooking = filtered.slice(startIndex, endIndex);
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
    return filtered;
  }
}
