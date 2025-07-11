// services/question.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../app/app.config';

export interface QuestionTableDTO {
  questionID: number;
  accountID: string;
  title: string;
  description: string;
  status: number;
  createdAt: string;
  updatedAt?: string;
  answer?: string;
  account: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email: string;
  };
}
export interface QuestionDTO {
  questionID: number;
  title: string;
  description: string;
  status: number; // 0 - 4
  createdAt: string;
  updatedAt?: string;
  answer?: string;
}
export interface NewQuestionDTO {
  questionID: number;
  accountID: string;
  title: string;
  description: string;
  status: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private apiUrl = environment.apiUrl + '/api/question'; // Đổi thành API thực tế của cậu

  constructor(private http: HttpClient) {}

  getAllQuestions(): Observable<QuestionTableDTO[]> {
    return this.http.get<QuestionTableDTO[]>(this.apiUrl);
  }

  // getQuestionById(id: number): Observable<QuestionTableDTO> {
  //   return this.http.get<QuestionTableDTO>(`${this.apiUrl}/${id}`);
  // }

  updateQuestion(id: number, question: QuestionTableDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, question);
  }

  createQuestion(question: {
    accountID: string;
    title: string;
    description: string;
  }): Observable<NewQuestionDTO> {
    return this.http.post<NewQuestionDTO>(this.apiUrl, question);
  }

  getQuestionsByAccountId(accountId: string): Observable<QuestionTableDTO[]> {
    return this.http.get<QuestionTableDTO[]>(
      `${this.apiUrl}/account/${accountId}`
    );
  }

  // Có thể bổ sung các hàm khác như getById, update, delete nếu cần
}
