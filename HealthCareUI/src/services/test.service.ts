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
// export interface Tests {
//   testID: number;
//   testName: string;
//   price: number;
//   description: string;
//   active: boolean;
// }

@Injectable({
  providedIn: 'root',
})
export class TestService {
  private apiUrl = environment.apiUrl + '/api/test'; // Đổi lại endpoint cho đúng với backend của bạn

  constructor(private http: HttpClient) {}

  // Lấy tất cả test
  getAllTests(): Observable<TestDTO[]> {
    return this.http.get<TestDTO[]>(this.apiUrl + '/list-test');
  }
  getTestById(id: number): Observable<TestDTO> {
    return this.http.get<TestDTO>(`${this.apiUrl}/${id}`);
  }
  getAllListTest(): Observable<TestDTO[]> {
    return this.http.get<TestDTO[]>(this.apiUrl + '/list-test');
  }
  // getTestById(): Observable<TestsDTO> {}
  addTest(payload: {
    TestName: string;
    Price: number;
    Description: string;
    active: boolean;
  }): Observable<any> {
    return this.http.post(this.apiUrl + '/add-test', payload);
  }
  editTest(
    id: number,
    payload: {
      testName: string;
      description: string;
      price: number;
      active: boolean;
    }
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }
}
