import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenstrualCycleDTO } from '../../../../../services/menstrual-cycle.service';

export interface MenstrualCycle {
  start_date: string; // ISO date string yyyy-MM-dd
  end_date: string;
  note?: string;
}

@Component({
  selector: 'app-created-menstrual-cycle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './created-menstrual-cycle.component.html',
  styleUrls: ['./created-menstrual-cycle.component.css']  // Sửa thành styleUrls
})
export class CreatedMenstrualCycleComponent {
  // Đổi private thành public để Angular có thể bind trong template
  cycle: MenstrualCycleDTO = {
    start_date: '',
    end_date: '',
    accountID: '',
    note: '',
    reminder_enabled: 0
  };

  @Output() save = new EventEmitter<MenstrualCycleDTO>();
  @Output() cancel = new EventEmitter<void>();

  onSubmit() {
    this.save.emit(this.cycle);
  }

  onCancel() {
    this.cancel.emit();
  }
}
