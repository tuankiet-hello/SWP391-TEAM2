import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  userName: string | null = null;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    console.log('✅ Header ngOnInit called');
    this.userName = this.authService.getUserNameToken();
  }
}
