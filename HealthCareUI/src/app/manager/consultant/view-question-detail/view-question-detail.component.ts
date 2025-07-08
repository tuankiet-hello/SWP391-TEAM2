import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { QuestionTableDTO } from '../../../../services/question.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CommonModule, DatePipe } from '@angular/common';
import { NzTagModule } from 'ng-zorro-antd/tag';
@Component({
  selector: 'app-view-question-detail',
  // standalone: true,
  imports: [NzModalModule, DatePipe, NzTagModule, CommonModule],
  templateUrl: './view-question-detail.component.html',
  styleUrl: './view-question-detail.component.css'
})
export class ViewQuestionDetailComponent implements OnInit, OnChanges {
  @Input() question?: QuestionTableDTO;
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    console.log('Init - question:', this.question); // thường là undefined
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('MODAL DATA:', this.question);
    if (changes['question']) {
      this.cd.detectChanges(); // ép Angular cập nhật view
    }
  }

  handleClose() {
    this.close.emit();
  }
}

