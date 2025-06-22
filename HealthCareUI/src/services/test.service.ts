import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = '/api/tests'; // Đổi lại endpoint cho đúng với backend của bạn

  constructor(private http: HttpClient) {}

  // Lấy tất cả test
  getAllTests(): Observable<TestDTO[]> {
    return this.http.get<TestDTO[]>(this.apiUrl);
  }

  // Lấy test theo ID
  getTestById(testID: number): Observable<TestDTO> {
    return this.http.get<TestDTO>(`${this.apiUrl}/${testID}`);
  }

  // Thêm mới test
  addTest(test: TestDTO): Observable<TestDTO> {
    return this.http.post<TestDTO>(this.apiUrl, test);
  }

  // Sửa test
  updateTest(testID: number, test: TestDTO): Observable<TestDTO> {
    return this.http.put<TestDTO>(`${this.apiUrl}/${testID}`, test);
  }

  // Đổi trạng thái Active/Inactive
  toggleActive(testID: number, active: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${testID}/active`, { active });
  }

  // Xóa test
  deleteTest(testID: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${testID}`);
  }
  // Thêm vào trong class TestService
createTest(test: TestDTO): Observable<TestDTO> {
  return this.http.post<TestDTO>(this.apiUrl, test);
}

}
