import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-home',
  imports: [HeaderComponent, FooterComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  scrollToFooter() {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToServicesSection() {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToBlogsSection() {
    const element = document.getElementById('blogs');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
