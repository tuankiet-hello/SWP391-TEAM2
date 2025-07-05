import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../../../../services/auth.service';
import {
  UserService,
  AccountDetailDTO,
} from '../../../../services/manager-user.service';

interface Booking {
  id: string;
  date: string;
  service: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
}
interface Question {
  id: string;
  date: string;
  title: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
}

@Component({
  selector: 'app-sidebar-profile',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.css'],
})
export class ManageProfileComponent implements OnInit {
  selectedFeature = 'Your Profile';
  userName: string | null = null;
  userid!: string;
  user!: AccountDetailDTO;

  features = [
    'Your Profile',
    'Edit Profile',
    'Change Password',
    'Booking History',
    'Question History',
  ];

  bookings: Booking[] = [];
  questions: Question[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    console.log('✅ Manage Profile ngOnInit called');
    this.userName = this.authService.getUserNameToken();
    this.userid = this.authService.getIdFromToken();

    this.userService.getUserById(this.userid).subscribe((user) => {
      this.user = user;
      console.log('đã nạp data user', this.user);
    });

    this.loadFakeBookings();
    this.loadFakeQuestions();
  }

  selectFeature(feature: string) {
    this.selectedFeature = feature;
  }

  loadFakeBookings() {
    this.bookings = [
      { id: 'BK001', date: '2025-07-01', service: 'Spa', status: 'Confirmed' },
      {
        id: 'BK002',
        date: '2025-07-02',
        service: 'Massage',
        status: 'Pending',
      },
      {
        id: 'BK003',
        date: '2025-07-03',
        service: 'Yoga Class',
        status: 'Cancelled',
      },
      {
        id: 'BK004',
        date: '2025-07-04',
        service: 'Fitness',
        status: 'Confirmed',
      },
      {
        id: 'BK005',
        date: '2025-07-05',
        service: 'Nutrition',
        status: 'Pending',
      },
      {
        id: 'BK006',
        date: '2025-07-06',
        service: 'Swimming',
        status: 'Confirmed',
      },
      {
        id: 'BK007',
        date: '2025-07-07',
        service: 'Haircut',
        status: 'Cancelled',
      },
      {
        id: 'BK008',
        date: '2025-07-08',
        service: 'Facial',
        status: 'Confirmed',
      },
    ];
  }

  loadFakeQuestions(): void {
    this.questions = [
      { id: 'BK001', date: '2025-07-01', title: 'Spa', status: 'Confirmed' },
      { id: 'BK002', date: '2025-07-02', title: 'Massage', status: 'Pending' },
      {
        id: 'BK003',
        date: '2025-07-03',
        title: 'Yoga Class',
        status: 'Cancelled',
      },
      {
        id: 'BK004',
        date: '2025-07-04',
        title: 'Fitness',
        status: 'Confirmed',
      },
      {
        id: 'BK005',
        date: '2025-07-05',
        title: 'Nutrition',
        status: 'Pending',
      },
      {
        id: 'BK006',
        date: '2025-07-06',
        title: 'Swimming',
        status: 'Confirmed',
      },
      {
        id: 'BK007',
        date: '2025-07-07',
        title: 'Haircut',
        status: 'Cancelled',
      },
      { id: 'BK008', date: '2025-07-08', title: 'Facial', status: 'Confirmed' },
    ];
  }
}
