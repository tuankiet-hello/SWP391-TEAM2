import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderManagerComponent } from '../header/header.component';
import {
  UserService,
  AccountTableDTO,
} from '../../../services/manager-user.service';
import {
  MenstrualService,
  MenstrualCycleDTO,
} from '../../../services/menstrual-cycle.service';
import {
  BookingService,
  TestBookingDTO,
} from '../../../services/test-booking.service';
import {
  AppointmentService,
  AppointmentDTO,
} from '../../../services/appointment.service';
import { AuthService } from '../../../services/auth.service';
import { QuestionService } from '../../../services/question.service';
import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { Router, RouterLink } from '@angular/router';
type RoleKey = 'customer' | 'manager' | 'staff' | 'consultant';

interface UserStats {
  total: number;
  active: number;
  banned: number;
}

interface AppointmentStats {
  total: number;
  completed: number;
  submitted: number;
  inProgress: number;
  pending: number;
  canceled: number;
}

interface TestStats {
  total: number;
  completed: number;
  submitted: number;
  inProgress: number;
  pending: number;
  canceled: number;
}
interface QuestionStats {
  total: number;
  answered: number;
  unanswered: number;
  canceled: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderManagerComponent,
    BaseChartDirective,
    RouterLink,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalUser!: number;
  totalStaff!: number;
  totalManager!: number;
  totalConsultant!: number;
  totalStaffActive!: number;
  totalManagerActive!: number;
  totalConsultantActive!: number;
  totalUserActive!: number;
  cycleUsers!: number;
  cycles!: MenstrualCycleDTO[];
  user!: AccountTableDTO[];
  tests!: TestBookingDTO[];
  appointments!: AppointmentDTO[];
  userStatsByRole!: Record<RoleKey, UserStats>;
  pieChartData!: any;
  pieChartDataTest!: any;
  pieChartDataQuestion!: any;
  roleLogin!: string | null;
  revenue?: number;
  constructor(
    private userService: UserService,
    private menstrualService: MenstrualService,
    private appointmentService: AppointmentService,
    private bookingService: BookingService,
    private questionService: QuestionService,
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.roleLogin = this.authService.getRoleFromToken();
    if (this.roleLogin != 'admin' && this.roleLogin != 'manager') {
      this.router.navigate(['/home']);
    } else {
      this.userService.getAllUsers().subscribe((data) => {
        this.user = data;
        this.loadUser();
      });
      this.menstrualService.getCycleList().subscribe((data) => {
        this.cycles = data;
        this.cycleUsers = new Set(data.map((c) => c.accountID)).size;
      });
      this.appointmentService.getAllAppointments().subscribe((data) => {
        this.appointmentStats.total = new Set(
          data.map((c) => c.accountID)
        ).size;
        this.appointmentStats.completed = data.filter(
          (u) => u.status == 4
        ).length;
        this.appointmentStats.inProgress = data.filter(
          (u) => u.status == 2
        ).length;
        this.appointmentStats.submitted = data.filter(
          (u) => u.status == 0
        ).length;
        this.appointmentStats.pending = data.filter(
          (u) => u.status == 1
        ).length;
        this.appointmentStats.canceled = data.filter(
          (u) => u.status == 3
        ).length;
        this.loadPieChartConsultation();
      });
      this.bookingService.getAllBookings().subscribe((data) => {
        this.testStats.total = data.length;
        this.testStats.inProgress = data.filter((u) => u.status == 2).length;
        this.testStats.submitted = data.filter((u) => u.status == 0).length;
        this.testStats.pending = data.filter((u) => u.status == 1).length;
        this.testStats.canceled = data.filter((u) => u.status == 3).length;
        this.testStats.completed = data.filter((u) => u.status == 4).length;
        this.tests = data.filter((u) => u.status == 4);
        this.revenueTotal();
        console.log(this.tests);
        this.loadPieChartBooking();
      });
      this.questionService.getAllQuestions().subscribe((data) => {
        this.questionStats.total = data.length;
        console.log(this.questionStats.total);
        this.questionStats.answered = data.filter((u) => u.status == 4).length;
        this.questionStats.unanswered = data.filter(
          (u) => u.status == 0
        ).length;
        this.questionStats.canceled = data.filter((u) => u.status == 3).length;
        this.loadPieChartQuestion();
      });
    }
  }

  revenueTotal() {
    this.revenue = 0;
    for (const test of this.tests) {
      this.revenue += test.test.price || 0;
    }
  }
  loadUser() {
    this.totalUser = this.user.filter((u) => u.role == 'customer').length;
    this.totalStaff = this.user.filter((u) => u.role == 'staff').length;
    this.totalManager = this.user.filter((u) => u.role == 'manager').length;
    this.totalConsultant = this.user.filter(
      (u) => u.role == 'consultant'
    ).length;

    this.totalUserActive = this.user.filter(
      (u) => u.accountStatus === 'Active' && u.role == 'customer'
    ).length;
    this.totalStaffActive = this.user.filter(
      (u) => u.accountStatus === 'Active' && u.role == 'staff'
    ).length;
    this.totalManagerActive = this.user.filter(
      (u) => u.accountStatus === 'Active' && u.role == 'manager'
    ).length;
    this.totalConsultantActive = this.user.filter(
      (u) => u.accountStatus === 'Active' && u.role == 'consultant'
    ).length;

    this.userStatsByRole = {
      customer: {
        total: this.totalUser,
        active: this.totalUserActive,
        banned: this.totalUser - this.totalUserActive,
      },
      manager: {
        total: this.totalManager,
        active: this.totalManagerActive,
        banned: this.totalManager - this.totalManagerActive,
      },
      staff: {
        total: this.totalStaff,
        active: this.totalStaffActive,
        banned: this.totalStaff - this.totalStaffActive,
      },
      consultant: {
        total: this.totalConsultant,
        active: this.totalConsultantActive,
        banned: this.totalConsultant - this.totalConsultantActive,
      },
    };
  }

  accountRoles: { key: RoleKey; label: string }[] = [
    { key: 'customer', label: 'Customer' },
    { key: 'manager', label: 'Manager' },
    { key: 'staff', label: 'Staff' },
    { key: 'consultant', label: 'Consultant' },
  ];

  questionStats: QuestionStats = {
    total: 80,
    answered: 65,
    unanswered: 15,
    canceled: 20,
  };

  // Số người dùng theo dõi chu kỳ

  // Thống kê lịch tư vấn
  appointmentStats: AppointmentStats = {
    total: 300,
    submitted: 15,
    completed: 100,
    inProgress: 60,
    pending: 20,
    canceled: 10,
  };

  // Thống kê lịch xét nghiệm
  testStats: TestStats = {
    total: 300,
    submitted: 15,
    completed: 100,
    inProgress: 60,
    pending: 20,
    canceled: 10,
  };

  loadPieChartConsultation() {
    this.pieChartData = {
      labels: ['Submitted', 'Completed', 'In Progress', 'Pending', 'Canceled'],
      datasets: [
        {
          data: [
            this.appointmentStats.submitted,
            this.appointmentStats.completed,
            this.appointmentStats.inProgress,
            this.appointmentStats.pending,
            this.appointmentStats.canceled,
          ],
          backgroundColor: [
            '#6366f1',
            '#14b8a6',
            '#d97706',
            '#a8a29e',
            '#991b1b',
          ],
          hoverBackgroundColor: [
            '#6366f1',
            '#14b8a6',
            '#d97706',
            '#a8a29e',
            '#991b1b',
          ],
        },
      ],
    };
  }

  loadPieChartBooking() {
    this.pieChartDataTest = {
      labels: ['Submitted', 'Completed', 'In Progress', 'Pending', 'Canceled'],
      datasets: [
        {
          data: [
            this.testStats.submitted,
            this.testStats.completed,
            this.testStats.inProgress,
            this.testStats.pending,
            this.testStats.canceled,
          ],
          backgroundColor: [
            '#4b5563',
            '#059669',
            '#b45309',
            '#6b7280',
            '#be123c',
          ],
          hoverBackgroundColor: [
            '#4b5563',
            '#059669',
            '#b45309',
            '#6b7280',
            '#be123c',
          ],
        },
      ],
    };
  }

  loadPieChartQuestion() {
    this.pieChartDataQuestion = {
      labels: ['Answered', 'Unanswered', 'Canceled'],
      datasets: [
        {
          data: [
            this.questionStats.answered,
            this.questionStats.unanswered,
            this.questionStats.canceled,
          ],
          backgroundColor: ['#388e3c', '#fbc02d', '#d32f2f'],
          hoverBackgroundColor: ['#388e3c', '#fbc02d', '#d32f2f'],
        },
      ],
    };
  }

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',

        labels: {
          color: '#1f2937',
          font: { size: 13, weight: 500 },
        },
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        color: '#fff',
        formatter: (value: number, context: any) => {
          const dataset = context.chart.data.datasets[0].data;
          const total = dataset.reduce(
            (sum: number, val: number) => sum + val,
            0
          );
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        },
        font: {
          weight: 'bold',
          size: 13,
        },
      },
    },
  };
}
