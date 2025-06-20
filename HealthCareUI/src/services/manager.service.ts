import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../app/app.config';
export interface TestsDTO{
  TestName: string;
  Price: number;
  Description: string;
  Active: boolean;
}
export interface Tests{
    TestID: number;
  TestName: string;
  Price: number;
  Description: string;
  Active: boolean;
}
@Injectable({ providedIn: 'root' })
export class ManagerService{
    private apiUrl = environment.apiUrl + '/api/test';
      constructor(private http: HttpClient) {}
    
      getAllListTest(): Observable<Tests[]> {
        return this.http.get<Tests[]>(this.apiUrl + '/list-test');
      }
    
    //   getUserById(id: string): Observable<AccountDetailDTO> {
    //     return this.http.get<AccountDetailDTO>(`${this.apiUrl}/${id}`);
    //   }
}