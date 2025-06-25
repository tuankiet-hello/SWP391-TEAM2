import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../app/app.config';
export interface TestsDTO {
  TestName: string;
  Price: number;
  Description: string;
  Active: boolean;
}
export interface Tests {
  testID: number;
  testName: string;
  price: number;
  description: string;
  active: boolean;
}
@Injectable({ providedIn: 'root' })
export class ManagerService {
  private apiUrl = environment.apiUrl + '/api/test';
  constructor(private http: HttpClient) {}

  getAllListTest(): Observable<Tests[]> {
    return this.http.get<Tests[]>(this.apiUrl + '/list-test');
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

  //   getUserById(id: string): Observable<AccountDetailDTO> {
  //     return this.http.get<AccountDetailDTO>(`${this.apiUrl}/${id}`);
  //   }
}
