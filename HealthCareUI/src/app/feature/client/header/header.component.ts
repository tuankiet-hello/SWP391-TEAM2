import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DoCheck } from '@angular/core';
@Component({
  selector: 'app-header',
  // standalone: true,
  imports: [RouterModule, FontAwesomeModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements DoCheck {
  menuOpen = false;
  role: string | null = null;
  isLoggedIn = false;
  userName: string | null = null;
  constructor(
    library: FaIconLibrary,
    private authService: AuthService,
    private router: Router
  ) {
    library.addIcons(faSearch);
  }
  ngDoCheck(): void {
    const currentLoginStatus = this.authService.isLoggedIn();
    if (this.isLoggedIn !== currentLoginStatus) {
      this.isLoggedIn = currentLoginStatus;
      this.role = this.authService.getRoleFromToken();
    }
  }
  ngOnInit(): void {
    console.log('✅ Header ngOnInit called');
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userName = this.authService.getUserNameToken();
    console.log('🔐 isLoggedIn:', this.isLoggedIn);
    console.log('🧑‍💼 role:', this.role);
  }
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  closeMenu() {
    this.menuOpen = false;
  }

  @Output() scrollToContact = new EventEmitter<void>();

  onContactClick(event: Event) {
    event.preventDefault(); // Ngăn reload
    this.scrollToContact.emit(); // Gửi tín hiệu lên HomeComponent
  }

  onContactMobileNavClick(event: Event) {
    event.preventDefault(); // ngăn reload
    this.closeMenu(); // đóng menu
    this.scrollToContact.emit(); // báo HomeComponent cuộn xuống footer
  }

  @Output() scrollToServices = new EventEmitter<void>();

  onServicesClick(event: Event) {
    event.preventDefault(); // Ngăn reload
    this.scrollToServices.emit(); // Gửi sự kiện lên HomeComponent
  }

  onServicesMobileNavClick(event: Event) {
    event.preventDefault(); // Ngăn reload/chuyển trang
    this.closeMenu();

    const services = document.getElementById('services');
    if (services) {
      services.scrollIntoView({ behavior: 'smooth' });
    }
  }

  @Output() scrollToBlogs = new EventEmitter<void>();

  onBlogClick(event: Event) {
    event.preventDefault(); // Ngăn reload
    this.scrollToBlogs.emit(); // Gửi sự kiện lên HomeComponent
  }

  onBlogMobileNavClick(event: Event) {
    event.preventDefault(); // Ngăn reload/chuyển trang
    this.closeMenu();

    const blogs = document.getElementById('blogs');
    if (blogs) {
      blogs.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // logout() {
  //   this.authService.logout();
  //   this.router.navigate(['/login']);
  // }
  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.role = null;
    this.router.navigate(['/home']);
  }
}
