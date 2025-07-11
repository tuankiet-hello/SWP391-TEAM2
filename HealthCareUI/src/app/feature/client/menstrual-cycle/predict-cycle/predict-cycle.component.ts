import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MenstrualCycleDTO,
  MenstrualService,
} from '../../../../../services/menstrual-cycle.service';
@Component({
  selector: 'app-predict-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './predict-cycle.component.html',
  styleUrl: './predict-cycle.component.css',
})
export class PredictViewComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() accountId!: string;
  @Input() predict!: any;
  start!: string;
  end!: string;
  constructor(private menstrualCycleService: MenstrualService) {}
  ngOnInit(): void {
    console.log('Hiển Thị Predict trong predictComponent', this.predict);
    this.start = this.predict.fertileWindow[0];
    this.end = this.predict.fertileWindow[1];
    console.log(this.start);
    console.log(this.end);
  }
  onClose() {
    this.close.emit();
  }

  remindCycle() {
    this.menstrualCycleService.remindCycle(this.accountId).subscribe({
      next: (res) => {
        // alert(res.message);
        console.log('thành công nhắc');
        console.log(res);
        this.close.emit();
      },
      error: (err) => {
        console.error('Lỗi khi nhắc đoán chu kỳ:', err);
        alert('nhắc dự đoán chu kỳ thất bại, vui lòng thử lại.');
      },
    });
  }
}
