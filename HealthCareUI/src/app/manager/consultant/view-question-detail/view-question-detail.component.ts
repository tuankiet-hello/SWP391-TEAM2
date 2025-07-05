import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuestionTableDTO } from '../../../../services/question.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CommonModule, DatePipe } from '@angular/common';
import { NzTagModule } from 'ng-zorro-antd/tag';
@Component({
  selector: 'app-view-question-detail',
  standalone: true,
  imports: [NzModalModule, DatePipe, NzTagModule, CommonModule],
  templateUrl: './view-question-detail.component.html',
  styleUrl: './view-question-detail.component.css'
})
export class ViewQuestionDetailComponent {
  @Input() question?: QuestionTableDTO;
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();

  ngOnChanges() {
  console.log('MODAL DATA:', this.question);
}

  handleClose() {
    this.close.emit();
  }

  getStatusText(status: number | undefined): string {
    switch (status) {
      case 0: return 'Submitted';
      case 1: return 'Pending';
      case 2: return 'Confirmed';
      case 3: return 'Canceled';
      case 4: return 'Completed';
      default: return 'Unknown';
    }
  }

  getStatusColor(status: number | undefined): string {
    switch (status) {
      case 0: return 'blue';
      case 1: return 'orange';
      case 2: return 'green';
      case 3: return 'red';
      case 4: return 'purple';
      default: return 'default';
    }
  }
}
