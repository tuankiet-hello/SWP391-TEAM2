// user-edit.component.ts
import {
  Component,
  inject,
  Input,
  OnInit,
  signal,
  computed,
  effect,
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
  regexusername = '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]+$';

  fb = inject(FormBuilder);

  form!: FormGroup;
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.buildForm();
    if (this.user) {
      this.form.patchValue(this.user);
      this.form.get('roles')?.setValue(this.user.roles || '');
    }
  }

  buildForm() {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userName: [
        '',
        [Validators.required, Validators.pattern(this.regexusername)],
      ],
      dateOfBirth: ['', Validators.required],
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
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      userName: formData.userName,
      dateOfBirth: formData.dateOfBirth,
      emailConfirmed: formData.emailConfirmed,
      accountStatus: formData.accountStatus,
      roles: formData.roles,
    };
    this.userService.editUser(this.userId, payload).subscribe({
      next: () => alert('User updated successfully'),
      error: (err) => {
        alert('Update failed ');
        console.error('EditUser error:', err.error.errors);
      },
    });
  }
}
