import { Component, Input, Output, EventEmitter } from '@angular/core';
import { QuestionTableDTO } from '../../../../services/question.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-answer-question',
  standalone: true,
  imports: [CommonModule, FormsModule, NzModalModule, NzFormModule, NzInputModule, NzSelectModule],
  templateUrl: './answer-question.component.html',
  styleUrl: './answer-question.component.css'
})
export class AnswerQuestionComponent {
  @Input() visible: boolean = false;
  @Input() question?: QuestionTableDTO;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<QuestionTableDTO>();

  statusOptions = [
    { label: 'Submitted', value: 0 },
    { label: 'Pending', value: 1 },
    { label: 'Confirmed', value: 2 },
    { label: 'Canceled', value: 3 },
    { label: 'Completed', value: 4 }
  ];

  editedQuestion?: QuestionTableDTO;

  ngOnChanges() {
    // Deep copy để không sửa trực tiếp object gốc
    this.editedQuestion = this.question ? { ...this.question } : undefined;
  }

  handleSave() {
    if (this.editedQuestion) {
      this.save.emit(this.editedQuestion);
    }
  }

  handleClose() {
    this.close.emit();
  }
}
