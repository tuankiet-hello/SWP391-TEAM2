import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  // constructor(
  //   public authService: AuthService,
  //   private router: Router) {}

  // logout() {
  //   this.authService.logout();
  //   this.router.navigate(['/home']);
  // }
}
