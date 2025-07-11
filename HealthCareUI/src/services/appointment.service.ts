import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../app/app.config';

export interface AccountViewDTO {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
}

export interface AppointmentDTO {
  appointmentID: number;
  accountID: string;
  appointmentDate: string;
  appointmentTime: string;
  status: number;
  account: AccountViewDTO;
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private apiUrl = environment.apiUrl + '/api/Appoinment';

  constructor(private http: HttpClient) {}

  getAllAppointments(): Observable<AppointmentDTO[]> {
    return this.http.get<AppointmentDTO[]>(`${this.apiUrl}`);
  }

  updateAppointment(dto: AppointmentDTO) {
    return this.http.put(`${this.apiUrl}/${dto.appointmentID}`, dto);
  }

  createAppointment(data: {
    accountID: string;
    appointmentDate: string;
    appointmentTime: string;
  }): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getAppointmentsByAccountAndDate(accountID: string, date: string): Observable<AppointmentDTO[]> {
    return this.http.get<AppointmentDTO[]>(
      `${this.apiUrl}/by-account-and-date?accountID=${accountID}&date=${date}`
    );
  }

  getAppointmentsByAccountID(accountID: string): Observable<AppointmentDTO[]> {
    return this.http.get<AppointmentDTO[]>(`${this.apiUrl}/account/${accountID}`);
  }

  updateAppointmentFromUser(dto: AppointmentDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/user-update/${dto.appointmentID}`, dto);
  }

}
