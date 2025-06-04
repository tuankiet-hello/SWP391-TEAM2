import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './feature/home/home.component';
import { LoginComponent } from './feature/Auth/login/login.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'HealthCareUI';
}
