import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';
import { HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-confirm-change-email',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './confirm-change-email.component.html',
  styleUrls: ['./confirm-change-email.component.css']
})
export class ConfirmChangeEmailComponent implements OnInit {
  status: 'pending' | 'success' | 'error' | 'change' = 'pending';
  message: string = '';
  email: string = '';
  token: string = '';
  userId: any;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
  this.route.queryParams.subscribe((params) => {
    const status = params['status'];
    this.userId = params['userId'] || ''; // thêm dòng này
    this.email = params['email'] || '';
    this.token = params['token'] || '';

    if (status === 'change') {
      this.status = 'change';
    } else if (this.userId && this.email && this.token) { // kiểm tra đủ 3 param
      this.confirmChangeEmail();
    } else {
      this.status = 'error';
      this.message = 'Missing email confirmation information.';
    }
  });
}

// confirmChangeEmail() {
//   this.status = 'pending';
//   this.authService.confirmChangeEmail(this.userId, this.email, this.token).subscribe({
//     next: (response: any) => {
//       this.status = 'success'; // Phải gán ở đây
//       this.message = response.message || 'Xác nhận email thành công!';
//       setTimeout(() => {
//         this.router.navigate(['/login']);
//       }, 5000);
//     },
//     error: (error) => {
//       this.status = 'error';
//       this.message = error.error?.message || 'Xác nhận email thất bại. Vui lòng thử lại.';
//     }
//   });
// }


confirmChangeEmail() {
  this.status = 'pending';
  this.authService.confirmChangeEmail(this.userId, this.email, this.token).subscribe({
    next: (response: any) => {
      console.log('Response from confirmChangeEmail:', response); // Debug response
      this.status = 'success';
      this.message = response?.message || 'Email confirmation successful!';
      // setTimeout(() => {
      //   this.router.navigate(['/login']);
      // }, 5000);
    },
    error: (error) => {
      console.error('Error from confirmChangeEmail:', error); // Debug lỗi
      this.status = 'error';
      this.message = error.error?.message || 'Email confirmation failed. Please try again.';
    }
  });
}

}


  // resendConfirmationEmail() {
  //   if (!this.email) {
  //     alert('Email không hợp lệ');
  //     return;
  //   }
  //   this.authService.resendChangeEmailConfirmation(this.email).subscribe({
  //     next: () => {
  //       alert('Đã gửi lại email xác nhận. Vui lòng kiểm tra hộp thư của bạn.');
  //     },
  //     error: (error) => {
  //       alert(error.error?.message || 'Không thể gửi lại email xác nhận. Vui lòng thử lại sau.');
  //     },
  //   });
  // }

