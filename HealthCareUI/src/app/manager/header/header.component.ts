import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
@Component({
  selector: 'app-header-manager',
  standalone: true,
  imports: [CommonModule, RouterModule, NzIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderManagerComponent {
  userName: string | null = null;
  role: string | null = null;
  dropdownOpen: boolean = false;
  constructor(private authService: AuthService, private router: Router) {}

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen; // Mở/đóng dropdown
  }
  ngOnInit(): void {
    console.log('✅ Header ngOnInit called');
    this.role = this.authService.getRoleFromToken();
    this.userName = this.authService.getUserNameToken();
  }
  logout(): void {
    this.authService.logout();
    this.role = null;
    this.router.navigate(['/home']);
  }
  onSubmit(): void {
    const isLoggedIn = this.authService.isLoggedIn();
    const role = this.authService.getRoleFromToken();

    if (!isLoggedIn || role?.toLowerCase() !== 'customer') {
      const currentUrl = this.router.url;
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: currentUrl },
      });
      return;
    }
  }
}
