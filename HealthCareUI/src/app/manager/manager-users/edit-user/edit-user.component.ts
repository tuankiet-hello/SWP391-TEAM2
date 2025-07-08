// user-edit.component.ts
import {
  Component,
  inject,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AccountDetailDTO,
  UserService,
} from '../../../../services/manager-user.service';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  standalone: true,
  selector: 'app-user-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class UserEditComponent implements OnInit {
  @Input() userId!: string;
  @Input() user!: AccountDetailDTO;
  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<AccountDetailDTO>();
  regexusername = '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]+$';
  regexemail = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]{2,}){1,2}$';

  fb = inject(FormBuilder);

  form!: FormGroup;
  constructor(private userService: UserService,
  private message: NzMessageService) {}

  ngOnInit() {
    this.buildForm();
    if (this.user) {
      this.form.patchValue(this.user);
      this.form.get('roles')?.setValue(this.user.roles || '');
    }
  }

  buildForm() {
    this.form = this.fb.group({
      firstName: [null, [cannotClearIfHasValue(this.user?.firstName)]],
      lastName: [null, [cannotClearIfHasValue(this.user?.firstName)]],
      email: ['', [Validators.required, Validators.pattern(this.regexemail)]],
      userName: ['', [Validators.required, Validators.pattern(this.regexusername)]],
      dateOfBirth: [null, [cannotClearIfHasValue(this.user?.firstName)]],
      gender: [null, [cannotClearIfHasValue(this.user?.firstName)]],
      emailConfirmed: [false],
      accountStatus: ['Active'],
      roles: [''],
    });
  }

  // loadUser(id: string) {
  //   this.userService.getUserById(id).subscribe({
  //     next: (user) => {
  //       this.form.patchValue(user);
  //     },
  //   });
  // }

  onCancel() {
    this.close.emit();
  }

  submit() {
    if (this.form.invalid) return;
    const formData = { ...this.form.value };

    // Nếu không có thay đổi, show message và return
    if (!this.isDataChanged(this.user, formData)) {
      this.message.info('No changes detected!');
      return;
    }

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      userName: formData.userName,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      emailConfirmed: formData.emailConfirmed,
      accountStatus: formData.accountStatus,
      roles: formData.roles,
    };
    this.userService.editUser(this.userId, payload).subscribe({
      next: () => {
        // Lấy lại thông tin user vừa update (nếu muốn chắc chắn)
        this.userService.getUserById(this.userId).subscribe((updatedUser) => {
          this.updated.emit(updatedUser); // emit user mới về cha
          // alert('User updated successfully');
        });
      },
      error: (err) => {
        // alert('Update failed ');
        console.error('Edit User error:', err.error.errors);
      },
    });
  }

  isDataChanged(original: any, edited: any): boolean {
    // So sánh từng trường cần thiết
    return (
      original.firstName !== edited.firstName ||
      original.lastName !== edited.lastName ||
      original.email !== edited.email ||
      original.userName !== edited.userName ||
      original.dateOfBirth !== edited.dateOfBirth ||
      original.gender !== edited.gender ||
      original.emailConfirmed !== edited.emailConfirmed ||
      original.accountStatus !== edited.accountStatus ||
      original.roles !== edited.roles
    );
  }


}

  export function cannotClearIfHasValue(initialValue: any): ValidatorFn {
    return (control: AbstractControl) => {
      // Nếu ban đầu có dữ liệu, nhưng hiện tại lại bị xóa (rỗng/null)
      if ((initialValue !== null && initialValue !== '') && (control.value === null || control.value === '')) {
        return { cannotClear: true };
      }
      return null;
    };
  }
