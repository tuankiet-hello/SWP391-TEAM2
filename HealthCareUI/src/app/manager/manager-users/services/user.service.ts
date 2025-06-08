import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AccountTableDTO {
  id: string;
  fullName: string;
  email: string;
  role: string;
  emailConfirmed: boolean;
  accountStatus: string;
}

export interface AccountDetailDTO {
  user: {
    id: string;
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
  };
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:5169/api/accounts/list-users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<AccountTableDTO[]> {
    return this.http.get<AccountTableDTO[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<AccountDetailDTO> {
    return this.http.get<AccountDetailDTO>(`${this.apiUrl}/${id}`);
  }
}
