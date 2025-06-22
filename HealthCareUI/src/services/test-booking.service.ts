import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../app/app.config';
// export interface  TestBookingDTO {
//     AccountID: string;
//     TestID : number;
//     Result: string;
//     bookingDate: string;    // Định dạng 'yyyy-MM-dd', ví dụ: '2025-06-21'
//     bookingTime: string;    // Định dạng 'HH:mm:ss', ví dụ: '09:15:00'
//     Status: number;
// }
// Thêm các interface phụ cho rõ ràng
export interface Account {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  // ... các trường khác nếu cần
}

export interface Test {
  testName: string;
  // ... các trường khác nếu cần
}

export interface TestBookingDTO {
  bookingID: number;
  accountID: string;
  testID: number;
  result: string;
  bookingDate: string;
  bookingTime: string;
  status: number;
  account: Account; // Thêm dòng này
  test: Test;       // Thêm dòng này
  // ... các trường khác nếu có
}
@Injectable({ providedIn: 'root' })
export class BookingService{
    private apiUrl = environment.apiUrl + '/api/booking';
      constructor(private http: HttpClient) {}
      getAllBookings(): Observable<TestBookingDTO[]> {
        return this.http.get<TestBookingDTO[]>(this.apiUrl + '/list-booking');
      }
     
}