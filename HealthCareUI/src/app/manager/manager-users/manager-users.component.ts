import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-manager-users',
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    HeaderComponent,
    NzTableModule,
    NzInputModule,
  ],
  templateUrl: './manager-users.component.html',
  styleUrl: './manager-users.component.css'
})
export class ManagerUsersComponent {
  emptyText = 'No data';
}
