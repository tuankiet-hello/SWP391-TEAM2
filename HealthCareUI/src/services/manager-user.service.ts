import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

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
  roles: string[];
  emailConfirmed: boolean;
  accountStatus: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = environment.apiAccountsUrl;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<AccountTableDTO[]> {
    return this.http.get<AccountTableDTO[]>(this.apiUrl + '/list-users');
  }

  getUserById(id: string): Observable<AccountDetailDTO> {
    return this.http.get<AccountDetailDTO>(`${this.apiUrl}/${id}`);
  }
}
