import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';
import { AppointmentService } from '../../../../services/appointment.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-make-appointment',
  standalone: true,
  imports: [FormsModule, CommonModule, NzDatePickerModule, NzTimePickerModule],
  templateUrl: './make-appointment.component.html',
  styleUrl: './make-appointment.component.css',
})
export class MakeAppointmentComponent {
  @Output() close = new EventEmitter<void>();
  submitted = false;
  isSubmitting = false; // đang gửi
  isAppointmentDone = false; // gửi xong thành công

  appointment = {
    appointmentDate: null as Date | null,
    appointmentTime: null as Date | null,
  };

  constructor(
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private notification: NzNotificationService,
    private modal: NzModalService
  ) {}

  closeModal() {
    this.close.emit();
  }

  // ❌ Disable weekend + past date + more than 1 month from today
  disableDate = (current: Date): boolean => {
    const today = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(today.getMonth() + 1);

    return (
      current.getDay() === 0 || // Sunday
      current.getDay() === 6 || // Saturday
      current < new Date(today.setHours(0, 0, 0, 0)) || // Past
      current > oneMonthLater
    );
  };

  getDisabledHours = (): number[] => {
    const allowed = [7, 8, 9, 10, 13, 14, 15, 16];
    return Array.from({ length: 24 }, (_, i) => i).filter(
      (h) => !allowed.includes(h)
    );
  };

  getDisabledMinutes = (): number[] => {
    return Array.from({ length: 60 }, (_, i) => i).filter((m) => m % 5 !== 0);
  };

  validateForm(
    accountID: string | null,
    appointmentDate: Date | null,
    appointmentTime: Date | null
  ): boolean {
    if (!appointmentDate || !appointmentTime) {
      this.notification.error(
        'Validation Error',
        'Date and time are required.',
        {
          nzPlacement: 'topRight',
          nzDuration: 3000,
          nzStyle: { top: '80px' },
        }
      );
      return false;
    }

    if (!accountID) {
      this.notification.error(
        'Authentication Error',
        'User ID not found in token.',
        {
          nzPlacement: 'topRight',
          nzDuration: 3000,
          nzStyle: { top: '80px' },
        }
      );
      return false;
    }

    return true;
  }

  formatTime(time: Date): string {
    return `${time.getHours().toString().padStart(2, '0')}:${time
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  }

  handleExistingAppointment(
    existing: any,
    dateStr: string,
    timeStr: string,
    accountID: string
  ) {
    const oldTime = existing.appointmentTime.slice(0, 5);
    const status = existing.status;
    console.log('existing.status =', status, typeof status);
    if ([0, 1, 2].includes(status)) {
      this.modal.confirm({
        nzTitle: 'Reschedule Confirmation',
        nzContent: `You already have an appointment at <b>${oldTime}</b>.<br>Do you want to reschedule to <b>${timeStr}</b>?`,
        nzOkText: 'Yes, Reschedule',
        nzCancelText: 'No',
        nzOnOk: () => {
          const updated = {
            ...existing,
            appointmentTime: timeStr,
            appointmentDate: dateStr,
            status: 0,
          };
          this.updateAppointment(updated);
        },
      });
    } else {
      this.createAppointment(accountID, dateStr, timeStr);
    }
  }

  updateAppointment(updated: any) {
    this.isSubmitting = true;
    this.appointmentService.updateAppointmentFromUser(updated).subscribe({
      next: () => {
        this.notification.success(
          'Success',
          'Appointment rescheduled successfully!',
          {
            nzPlacement: 'topRight',
            nzDuration: 3000,
            nzStyle: { top: '80px' },
          }
        );
        this.isAppointmentDone = true;
        this.closeModal();
      },
      error: () => {
        this.notification.error('Error', 'Failed to update appointment.', {
          nzPlacement: 'topRight',
          nzDuration: 3000,
          nzStyle: { top: '80px' },
        });
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }

  createAppointment(accountID: string, dateStr: string, timeStr: string) {
    this.isSubmitting = true;
    const payload = {
      accountID,
      appointmentDate: dateStr,
      appointmentTime: timeStr,
    };

    this.appointmentService.createAppointment(payload).subscribe({
      next: () => {
        this.notification.success(
          'Success',
          'Appointment created successfully!',
          {
            nzPlacement: 'topRight',
            nzDuration: 3000,
            nzStyle: { top: '80px' },
          }
        );
        this.isAppointmentDone = true; // ✅ disable sau khi thành công
        this.closeModal();
      },
      error: () => {
        this.notification.error('Error', 'Failed to create appointment.', {
          nzPlacement: 'topRight',
          nzDuration: 3000,
          nzStyle: { top: '80px' },
        });
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }

  resetForm() {
    this.closeModal();
    this.appointment = { appointmentDate: null, appointmentTime: null };
    this.submitted = false;
  }

  onSubmit() {
    this.submitted = true;

    const { appointmentDate, appointmentTime } = this.appointment;
    const accountID = this.authService.getIdFromToken();

    if (!this.validateForm(accountID, appointmentDate, appointmentTime)) return;

    const dateStr = (appointmentDate as Date).toISOString().split('T')[0];
    const timeStr = this.formatTime(appointmentTime as Date);

    this.appointmentService
      .getAppointmentsByAccountAndDate(accountID, dateStr)
      .subscribe({
        next: (existingAppointments) => {
          const modifiable = existingAppointments.find((app: any) =>
            [0, 1, 2].includes(Number(app.status))
          );

          if (modifiable) {
            this.handleExistingAppointment(
              modifiable,
              dateStr,
              timeStr,
              accountID
            );
          } else {
            this.createAppointment(accountID, dateStr, timeStr);
          }
        },
        error: () => {
          this.notification.error(
            'Error',
            'Failed to check existing appointments.',
            {
              nzPlacement: 'topRight',
              nzDuration: 3000,
              nzStyle: { top: '80px' },
            }
          );
        },
      });
  }
}
