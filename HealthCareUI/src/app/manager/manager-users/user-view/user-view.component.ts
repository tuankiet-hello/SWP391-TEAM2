import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountDetailDTO } from '../services/user.service';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.css'
})
export class UserViewComponent {
  @Input() user!: AccountDetailDTO;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
