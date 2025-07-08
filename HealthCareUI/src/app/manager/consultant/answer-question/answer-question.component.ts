import { Component, Input, Output, EventEmitter } from '@angular/core';
import { QuestionTableDTO } from '../../../../services/question.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

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
    // { label: 'Pending', value: 1 },
    // { label: 'Confirmed', value: 2 },
    { label: 'Canceled', value: 3 },
    { label: 'Completed', value: 4 }
  ];

  editedQuestion?: QuestionTableDTO;

  constructor(private message: NzMessageService) {}

  ngOnChanges() {
    // Deep copy để không sửa trực tiếp object gốc
    this.editedQuestion = this.question ? { ...this.question } : undefined;
  }

  handleSave(form: NgForm): void {
    if (!this.editedQuestion) return;

    // Nếu không có thay đổi, show message và return
    if (!this.isDataChanged()) {
      this.message.info('No changes detected!');
      return;
    }

    // Nếu status khác 0 (tức là không phải Submitted) → phải nhập answer
    if (this.editedQuestion.status !== 0 && (!this.editedQuestion.answer || this.editedQuestion.answer.trim() === '')) {
      this.message.error('Please enter an answer before submitting.');
      return;
    }

    this.editedQuestion.status = Number(this.editedQuestion.status);
    console.log('DỮ LIỆU GỬI:', JSON.stringify({ dto: this.editedQuestion }, null, 2));
    this.save.emit(this.editedQuestion);
  }

  handleClose() {
    this.close.emit();
  }

  isDataChanged(): boolean {
    if (!this.question || !this.editedQuestion) return false;
    return (
      this.question.status !== this.editedQuestion.status ||
      (this.question.answer || '') !== (this.editedQuestion.answer || '')
    );
  }
}
