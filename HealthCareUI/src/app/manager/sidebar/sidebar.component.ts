import { Component} from '@angular/core';
import { CreateUserComponent } from '../manager-users/create-user/create-user.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, CreateUserComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  // @Output() close = new EventEmitter<void>();
  showModal = false;
  closeModal() {
    this.showModal = false;
  }
  openModal() {
    console.log('CLICK! 🔥'); // 👈 thêm dòng này
    this.showModal = true;
  }
}
