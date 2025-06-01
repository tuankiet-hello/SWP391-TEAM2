import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit {
  status: 'pending' | 'success' | 'error' = 'pending';
  message: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const email = this.route.snapshot.queryParamMap.get('email');
    const token = this.route.snapshot.queryParamMap.get('token');
    if (email && token) {
      this.http.get<any>(`/api/Auth/confirm-email?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`)
        .subscribe({
          next: (res) => {
            this.status = 'success';
            this.message = res.message || 'Xác nhận email thành công!';
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 5000); // chuyển sang trang login sau 5 giây
          },
          error: (err) => {
            this.status = 'error';
            this.message = err.error?.message || 'Token không hợp lệ hoặc đã hết hạn.';
          }
        });
    } else {
      this.status = 'error';
      this.message = 'Thiếu thông tin xác nhận.';
    }
  }
}
