import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../app/app.config';

export interface AccountTableDTO {
  id: string;
  fullName: string;
  email: string;
  role: string;
  emailConfirmed: boolean;
  accountStatus: string;
}
export interface AccountDetailDTO {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  dateOfBirth: string;
  roles: string;
  emailConfirmed: boolean;
  accountStatus: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = environment.apiUrl + '/api/accounts';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<AccountTableDTO[]> {
    return this.http.get<AccountTableDTO[]>(this.apiUrl + '/list-users');
  }

  getUserById(id: string): Observable<AccountDetailDTO> {
    return this.http.get<AccountDetailDTO>(`${this.apiUrl}/${id}`);
  }

  createUser(payload: {
    email: string;
    userName: string;
    password: string;
    confirmPassword: string;
    role: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-user`, payload);
  }

  editUser(
    id: string,
    payload: {
      firstName: string;
      lastName: string;
      email: string;
      userName: string;
      dateOfBirth: string;
      roles: string;
    }
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }

  banUser(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/ban`, {});
  }

  unbanUser(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/unban`, {});
  }
}
