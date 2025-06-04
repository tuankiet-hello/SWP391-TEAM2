import { Component } from '@angular/core';
import { LoginComponent } from '../Auth/login/login.component';

import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // Để sử dụng icon FontAwesome, cần import thư viện hoặc dùng CDN trong index.html
}
