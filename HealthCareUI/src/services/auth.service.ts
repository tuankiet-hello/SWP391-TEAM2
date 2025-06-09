import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiAuthUrl;

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

  login(payload: { UsernameOrEmail: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, payload);
  }

  register(payload: { email: string; userName: string; password: string;
                      confirmPassword: string; }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  resetPassword(payload: {email: string; token: string; newPassword: string;
                          confirmPassword: string; }): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, payload);
  }
}
