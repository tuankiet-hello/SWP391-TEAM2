import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../app/app.config';
import { HttpParams } from '@angular/common/http';
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
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  // ... các trường khác nếu cần
}

export interface Test {
  testID: number;
  testName: string;
  description?: string;
  price?: number;
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
  test: Test; // Thêm dòng này
  // ... các trường khác nếu có
}
export interface EditTestBookingDTO {
  testID: number;
  result: string;
  bookingDate: string;
  bookingTime: string;
  status: number;
}
export interface CreateTestBookingDTO {
  // bookingID: number;
  accountID: string;
  testID: number;
  result: string;
  bookingDate: string;
  bookingTime: string;
  status: number;
  // account: Account; // Thêm dòng này
  // test: Test;       // Thêm dòng này
  // ... các trường khác nếu có
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private apiUrl = environment.apiUrl + '/api/Booking';
  constructor(private http: HttpClient) {}
  getAllBookings(): Observable<TestBookingDTO[]> {
    return this.http.get<TestBookingDTO[]>(this.apiUrl + '/list-booking');
  }
  getBookingById(id: number): Observable<TestBookingDTO> {
    return this.http.get<TestBookingDTO>(`${this.apiUrl}/${id}`);
  }
  getBookingHisById(id: string): Observable<TestBookingDTO[]> {
    const params = new HttpParams().set('accountId', id);
    return this.http.get<TestBookingDTO[]>(`${this.apiUrl}/history`, {
      params,
    });
  }

  editBooking(
    id: number,
    accountID: string, // 👈 thêm tham số accountID ở đây
    payload: {
      testID: number;
      result: string;
      bookingDate: string;
      bookingTime: string;
      status: number;
    }
  ): Observable<any> {
    const params = new HttpParams().set('accountID', accountID); // 👈 thêm accountID vào query
    return this.http.put(`${this.apiUrl}/${id}`, payload, { params });
  }

  addBooking(payload: {
    accountID: string;
    testID: number;
    result: string;
    bookingDate: string;
    bookingTime: string;
    status: number;
  }): Observable<any> {
    return this.http.post(this.apiUrl + '/add-booking', payload);
  }

  createBookingForUser(payload: {
    accountID: string;
    testID: number;
    result: string;
    bookingDate: string;
    bookingTime: string;
    status: number;
  }): Observable<any> {
    return this.http.post( `${this.apiUrl}/create-booking`, payload);
  }
}
