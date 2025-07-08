import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { HeaderManagerComponent } from '../../header/header.component';

import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { FilterOutline } from '@ant-design/icons-angular/icons';
import { SearchOutline } from '@ant-design/icons-angular/icons';

import {
  AccountDetailDTO
} from '../../../../services/manager-user.service';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { QuestionService, QuestionTableDTO } from '../../../../services/question.service';
import { ViewQuestionDetailComponent } from '../view-question-detail/view-question-detail.component';
import { AnswerQuestionComponent } from '../answer-question/answer-question.component';

@Component({
  selector: 'app-view-question',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule,
      SidebarComponent,
      HeaderManagerComponent,
      NzTableModule,
      NzInputModule,
      NzModalModule,
      NzSelectModule,
      NzDropDownModule,
      NzIconModule,
      NzTagModule,
      ViewQuestionDetailComponent,
      AnswerQuestionComponent],
  templateUrl: './view-question.component.html',
  styleUrl: './view-question.component.css'
})
export class ViewQuestionComponent implements OnInit {
  emptyText = 'No users found';

  questions: QuestionTableDTO[] = [];
  filteredQuestions: QuestionTableDTO[] = [];
  displayedQuestions: QuestionTableDTO[] = [];

  selectedQuestion?: QuestionTableDTO;
  isQuestionModalVisible: boolean = false;

  selectedEditQuestion?: QuestionTableDTO;
  isEditModalVisible = false;
  originalEditQuestion?: QuestionTableDTO;

  idChoose: string = '';
  searchTerm: string = '';

  // Phân trang
  currentPage = 1;
  pageSize = 6; // số user trên mỗi trang
  totalUsers = 0;
  totalPages = 0;

  constructor(
    private questionService: QuestionService ,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.questionService.getAllQuestions().subscribe((data) => {
      this.questions  = data;
      this.applyFilters(); // Gọi filter luôn để cập nhật filteredUsers và phân trang
    });
  }

  updateDisplayedQuestions(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedQuestions  = this.filteredQuestions.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedQuestions();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedQuestions();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedQuestions();
    }
  }

  onSearchChange() {
    this.applyFilters();
  }

  openQuestionDetail(question: QuestionTableDTO) {
    this.selectedQuestion = question;
    this.isQuestionModalVisible = true;
  }

  closeQuestionModal() {
    this.isQuestionModalVisible = false;
    this.selectedQuestion = undefined;
  }

  openEditQuestionModal(question: QuestionTableDTO) {
    this.selectedEditQuestion = { ...question }; // copy để tránh sửa trực tiếp
    this.originalEditQuestion = { ...question }; // lưu bản gốc để so sánh
    this.isEditModalVisible = true;
  }

  isQuestionChanged(original: QuestionTableDTO, edited: QuestionTableDTO): boolean {
    // So sánh các trường bạn muốn kiểm tra thay đổi
    return (
      original.title !== edited.title ||
      original.description !== edited.description ||
      original.status !== edited.status ||
      original.answer !== edited.answer
      // ... thêm các trường khác nếu cần
    );
  }


  saveEditQuestion(edited: QuestionTableDTO) {
    // Nếu không có thay đổi thì báo và không gọi API
    if (!this.isQuestionChanged(this.originalEditQuestion!, edited)) {
      this.message.info('No updates to the question');
      this.isEditModalVisible = false;
      this.selectedEditQuestion = undefined;
      return;
    }

    this.questionService.updateQuestion(edited.questionID, edited).subscribe(() => {
      this.isEditModalVisible = false;
      this.selectedEditQuestion = undefined;
      this.message.success('Question has been updated successfully!');

      // Cập nhật trong questions
      const idx = this.questions.findIndex(q => q.questionID === edited.questionID);
      if (idx !== -1) {
        this.questions[idx] = { ...edited };
      }

      // Cập nhật trong filteredQuestions nếu có
      const idxFiltered = this.filteredQuestions.findIndex(q => q.questionID === edited.questionID);
      if (idxFiltered !== -1) {
        this.filteredQuestions[idxFiltered] = { ...edited };
      }

      this.updateDisplayedQuestions();
    });
  }




  filterVisible = {
    title: false,
    status: false,
    fullName: false,
  };

  filter = {
    titleSort: '',
    fullNameSort: '',
    status: '',
  };

  applyFilters() {
    let filtered = [...this.questions];

    // Search theo tên hoặc email
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const search = this.searchTerm.trim().toLowerCase();
      filtered = filtered.filter(question =>
        (question.account.firstName + ' ' + question.account.lastName).toLowerCase().includes(search) ||
        question.title.toLowerCase().includes(search)
      );
    }

    // Filter Status
    if (this.filter.status) {
      filtered = filtered.filter(question => String(question.status) === String(this.filter.status));
    }

    // Sort Full Name
    if (this.filter.titleSort === 'az') {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (this.filter.titleSort === 'za') {
      filtered = filtered.sort((a, b) => b.title.localeCompare(a.title));
    }

    // Sort full name
    if (this.filter.fullNameSort === 'az') {
      filtered = filtered.sort((a, b) =>
        (a.account.firstName + ' ' + a.account.lastName).localeCompare(b.account.firstName + ' ' + b.account.lastName)
      );
    } else if (this.filter.fullNameSort === 'za') {
      filtered = filtered.sort((a, b) =>
        (b.account.firstName + ' ' + b.account.lastName).localeCompare(a.account.firstName + ' ' + a.account.lastName)
      );
    }

    this.filteredQuestions  = filtered;
    this.totalUsers = this.filteredQuestions .length;
    this.totalPages = Math.ceil(this.totalUsers / this.pageSize);
    this.currentPage = 1; // Reset về trang 1 mỗi khi filter
    this.updateDisplayedQuestions();
  }

  setTitleSort(sort: string) {
    this.filter.titleSort = sort;
    this.filterVisible.title = false;
    this.applyFilters();
  }

  setStatus(val: string) {
    this.filter.status = val;
    this.filterVisible.status = false;
    this.applyFilters();
  }

  setFullNameSort(sort: string) {
    this.filter.fullNameSort = sort;
    this.filterVisible.fullName = false;
    this.applyFilters();
  }
}
