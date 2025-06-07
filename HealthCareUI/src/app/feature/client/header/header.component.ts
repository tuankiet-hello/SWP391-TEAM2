import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  imports: [RouterModule, FontAwesomeModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  menuOpen = false;
  constructor(library: FaIconLibrary) {
    library.addIcons(faSearch);
  }
  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu() { this.menuOpen = false; }

  @Output() scrollToContact = new EventEmitter<void>();

  onContactClick(event: Event) {
    event.preventDefault(); // Ngăn reload
    this.scrollToContact.emit(); // Gửi tín hiệu lên HomeComponent
  }

  onContactMobileNavClick(event: Event) {
    event.preventDefault(); // ngăn reload
    this.closeMenu();       // đóng menu
    this.scrollToContact.emit(); // báo HomeComponent cuộn xuống footer
  }

  @Output() scrollToServices = new EventEmitter<void>();

  onServicesClick(event: Event) {
    event.preventDefault();         // Ngăn reload
    this.scrollToServices.emit();   // Gửi sự kiện lên HomeComponent
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
    event.preventDefault();         // Ngăn reload
    this.scrollToBlogs.emit();   // Gửi sự kiện lên HomeComponent
  }

  onBlogMobileNavClick(event: Event) {
    event.preventDefault(); // Ngăn reload/chuyển trang
    this.closeMenu();

    const blogs = document.getElementById('blogs');
    if (blogs) {
      blogs.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
