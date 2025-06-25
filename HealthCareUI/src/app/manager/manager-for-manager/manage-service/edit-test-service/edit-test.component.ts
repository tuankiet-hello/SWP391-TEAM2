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
import { TestDTO, TestService } from '../../../../../services/test.service';

@Component({
  standalone: true,
  selector: 'app-test-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-test.component.html',
  styleUrls: ['./edit-test.component.css'],
})
export class TestEditComponent {
  fb = inject(FormBuilder);
  form!: FormGroup;
  @Input() user!: TestDTO;
  @Input() active!: boolean;
  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<TestDTO>();
  constructor(private testService: TestService) {}

  ngOnInit() {
    this.buildForm();
    if (this.user) {
      this.form.patchValue(this.user);
    }
  }

  buildForm() {
    this.form = this.fb.group({
      testName: ['', Validators.required],
      description: ['', Validators.required],
      price: [Validators.required],
      active: [true],
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
      testName: formData.testName,
      description: formData.description,
      price: formData.price,
      active: formData.active === 'true' ? true : false,
    };
    this.testService.editTest(this.user.testID, payload).subscribe({
      next: () => {
        // Lấy lại thông tin user vừa update (nếu muốn chắc chắn)
        this.testService
          .getTestById(this.user.testID)
          .subscribe((updatedUser) => {
            this.updated.emit(updatedUser); // emit user mới về cha
            // alert('User updated successfully');
            this.onCancel();
          });
      },
      error: (err) => {
        // alert('Update failed ');
        console.error('EditTest error:', err.error.errors);
      },
    });
  }
}
