import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountDetailDTO } from '../../../../services/manager-user.service';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.css',
})
export class UserViewComponent {
  @Input() user!: AccountDetailDTO;
  @Output() close = new EventEmitter<void>();

  get displayRoles(): string {
    if (Array.isArray(this.user?.roles)) {
      return this.user.roles.join(', ');
    }
    if (typeof this.user?.roles === 'string') {
      return this.user.roles;
    }
    return 'N/A';
  }
  onClose() {
    this.close.emit();
  }
}
