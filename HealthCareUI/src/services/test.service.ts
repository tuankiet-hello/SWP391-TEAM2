import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../app/app.config';

// Định nghĩa interface cho Test
export interface TestDTO {
  testID: number;
  testName: string;
  description: string;
  price: number;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private apiUrl =  environment.apiUrl +'/api/test'; // Đổi lại endpoint cho đúng với backend của bạn

  constructor(private http: HttpClient) {}

  // Lấy tất cả test
  getAllTests(): Observable<TestDTO[]> {
    return this.http.get<TestDTO[]>(this.apiUrl+ '/list-test');
  }

}
