import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  // standalone: true,
  imports: [
    RouterModule,
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    NzInputModule,
    NzAutocompleteModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  menuOpen = false;
  role: string | null = null;
  isLoggedIn = false;
  userName: string | null = null;

  @Input() blogs: any[] = [];
  searchValue = '';
  filteredBlogs: any[] = [];
  overlayStyle = { 'z-index': '2000', 'margin-top': '20px' };

  constructor(
    library: FaIconLibrary,
    private authService: AuthService,
    private router: Router
  ) {
    library.addIcons(faSearch);
  }

  ngOnInit(): void {
    console.log('✅ Header-Manager ngOnInit called');
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

  @Output() scrollToAbout = new EventEmitter<void>();

  onAboutClick(event: Event) {
    event.preventDefault(); // Ngăn reload
    this.scrollToAbout.emit(); // Gửi sự kiện lên HomeComponent
  }

  onAboutMobileNavClick(event: Event) {
    event.preventDefault(); // Ngăn reload/chuyển trang
    this.closeMenu();

    const about = document.getElementById('about');
    if (about) {
      about.scrollIntoView({ behavior: 'smooth' });
    }
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.role = null;
    this.router.navigate(['/home']);
  }

  @Output() search = new EventEmitter<string>();

  onInputChange() {
    const search = this.searchValue.trim().toLowerCase();
    this.filteredBlogs = !search
      ? []
      : this.blogs.filter(
          (blog) =>
            blog.title.toLowerCase().includes(search) ||
            blog.desc.toLowerCase().includes(search)
        );
  }

  goToBlog(link: string) {
    this.router.navigate([link]);
    this.searchValue = '';
    this.filteredBlogs = [];
  }
}
