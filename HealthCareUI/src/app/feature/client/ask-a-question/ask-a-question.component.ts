import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuestionService  } from '../../../../services/question.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-ask-a-question',
  standalone: true,
  imports: [FormsModule, NzModalModule, CommonModule],
  templateUrl: './ask-a-question.component.html',
  styleUrl: './ask-a-question.component.css'
})
export class AskAQuestionComponent {
  @Output() close = new EventEmitter<void>();
  isSubmitting = false;


  question = {
    title: '',
    description: ''
  };

  constructor(
    private questionService: QuestionService,
    private authService: AuthService,
    private message: NzMessageService,
    private notification: NzNotificationService) {}

  closeModal() {
    this.close.emit();
  }

  onSubmit() {
  if (!this.question.title || !this.question.description) {
    return;
  }

  const accountId = this.authService.getIdFromToken();
    if (!accountId) {
      console.error('User ID not found in token');
      return;
    }

    const questionWithId = {
      ...this.question,
      accountID: accountId
    };
    this.isSubmitting = true;

    console.log('Payload gửi đi:', questionWithId);

    this.questionService.createQuestion(questionWithId).subscribe({
      next: (res) => {
        console.log('Question submitted successfully!', res);
        this.notification.success('Success', 'Your question has been submitted successfully!', {
          nzPlacement: 'topRight', // hoặc 'topLeft', 'bottomLeft', 'bottomRight'
          nzDuration: 3000,
          nzStyle: { top: '80px' }
        });
        this.close.emit();
        // });
        this.closeModal();
        this.question = { title: '', description: '' };
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Error submitting question:', err);
        this.notification.error('Error', 'Failed to submit your question. Please try again.',{
          nzPlacement: 'topRight',
          nzDuration: 3000,
          nzStyle: { top: '80px' }
        });
        this.isSubmitting = false;
      }
    });
  }

}
