import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../app/app.config';
import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
  unique_name: string;
  nameid: string;
  role: string | string[];
  sub: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl + '/api/Auth';

  constructor(private http: HttpClient) {}

  confirmEmail(payload: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/confirm-email`, {
      params: payload,
    });
  }

  resendConfirmationEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/resend-confirm-email`, { email });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  login(payload: {
    UsernameOrEmail: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, payload);
  }

  register(payload: {
    email: string;
    userName: string;
    password: string;
    confirmPassword: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  resetPassword(payload: {
    email: string;
    token: string;
    newPassword: string;
    confirmPassword: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, payload);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  logout() {
    return localStorage.removeItem('accessToken');
  }

  getRoleFromToken(): string | null {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      if (Array.isArray(decoded.role)) {
        return decoded.role[0]; // nếu có nhiều role thì lấy cái đầu tiên
      }

      return decoded.role;
    } catch (e) {
      console.error('Token decode failed:', e);
      return null;
    }
  }
  getUserNameToken(): string | null {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      return decoded.unique_name;
    } catch (e) {
      console.error('Token decode failed:', e);
      return null;
    }
  }

  getIdFromToken(): string {
    const token = localStorage.getItem('accessToken');
    if (!token) return '';

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      return decoded.sub;
    } catch (e) {
      console.error('Token decode failed:', e);
      return '';
    }
  }

  // Sửa trong UserService:
  getUserProfile(): Observable<{
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
  }> {
    const token = localStorage.getItem('accessToken') || '';
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<{
      userName: string;
      email: string;
      firstName: string;
      lastName: string;
      dateOfBirth: string;
    }>(`${this.apiUrl}/user-profile`, { headers });
  }

  editProfile(payload: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
  }): Observable<any> {
    const token = localStorage.getItem('accessToken') || '';
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put(`${this.apiUrl}/edit-profile`, payload, { headers });
  }
}
