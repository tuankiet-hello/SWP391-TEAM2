import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { HeaderComponent } from '../../header/header.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-manage-service',
  imports: [
      CommonModule,
      FormsModule,
      SidebarComponent,
      HeaderComponent,
      NzTableModule,
      NzInputModule,
      NzModalModule,
      NzSelectModule,
      NzDropDownModule,
      NzIconModule,
    ],
    providers: [

    ],
  templateUrl: './manage-service.component.html',
  styleUrl: './manage-service.component.css'
})
export class ManageServiceComponent {

}
