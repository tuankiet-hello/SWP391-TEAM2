import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './appointment-card.component.html',
  styleUrls: ['./appointment-card.component.css'],
})
export class AppointmentCardComponent {
  cardForm: FormGroup;
  role: string | null = null;
  @Input() imageUrl!: string;
  @Input() title!: string;
  @Input() price!: number;
  @Input() description!: string;
  @Input() status!: boolean;
  @Input() id!: number;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.cardForm = this.fb.group({}); // hoặc bỏ nếu chưa dùng
  }

  ngOnInit(): void {
    console.log('✅ appointment ngOnInit called');
    this.role = this.authService.getRoleFromToken();
  }

  onSubmit(): void {
    const isLoggedIn = this.authService.isLoggedIn();
    const role = this.authService.getRoleFromToken();

    if (!isLoggedIn || role?.toLowerCase() === null) {
      const currentUrl = this.router.url;
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: currentUrl },
      });
      return;
    } else if (
      role?.toLowerCase() === 'manager' ||
      role?.toLowerCase() === 'admin'
    ) {
    }

    this.openBookingPopup();
  }

  openBookingPopup(): void {
    console.log('🔔 Hiện form pop-up để đặt lịch');
  }
}
