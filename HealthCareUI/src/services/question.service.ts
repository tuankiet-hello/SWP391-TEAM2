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

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = environment.apiUrl + '/api/question'; // Đổi thành API thực tế của cậu

  constructor(private http: HttpClient) {}

  getAllQuestions(): Observable<QuestionTableDTO[]> {
    return this.http.get<QuestionTableDTO[]>(this.apiUrl);
  }

  // Có thể bổ sung các hàm khác như getById, update, delete nếu cần
}
