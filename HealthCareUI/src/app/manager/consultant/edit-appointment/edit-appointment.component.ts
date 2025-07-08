import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppointmentDTO } from '../../../../services/appointment.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';


@Component({
  selector: 'app-edit-appointment',
  // standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-appointment.component.html',
  styleUrl: './edit-appointment.component.css'
})
export class EditAppointmentComponent implements OnInit {
  @Input() data: AppointmentDTO = {} as AppointmentDTO;
  @Output() save = new EventEmitter<AppointmentDTO>();
  @Output() cancel = new EventEmitter<void>();

  editData: any = {};
  hours: string[] = [];
  minutes: string[] = [];
  todayStr = new Date().toISOString().slice(0, 10);

  constructor(private message: NzMessageService) {}

  // constructor(private dialogRef: MatDialogRef<EditAppointmentComponent>) {}

  ngOnInit() {
    // Tạo mảng giờ và phút (bội số của 5)
    this.hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    this.minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

    if (this.data) {
      // Tách giờ và phút từ appointmentTime
      const [hour, minute] = this.data.appointmentTime.split(':');
      this.editData = {
        appointmentDate: this.data.appointmentDate,
        hour,
        minute,
        status: this.data.status
      };
    }
  }

  // onSave() {
  //   const updatedAppointment: AppointmentDTO = {
  //     ...this.data,
  //     appointmentDate: this.editData.appointmentDate,
  //     appointmentTime: `${this.editData.hour}:${this.editData.minute}`,
  //     status: this.editData.status
  //   };
  //   this.dialogRef.close(updatedAppointment); // Đóng dialog và truyền dữ liệu về cha
  // }

  onSave() {
    // Kiểm tra nếu không có thay đổi thì báo và không emit
    if (!this.isDataChanged()) {
      this.message.info('No changes detected!');
      return;
    }

    // Ghép ngày và giờ thành đối tượng Date
    const selectedDateStr = this.editData.appointmentDate;
    const hour = this.editData.hour || '00';
    const minute = this.editData.minute || '00';
    const selectedDateTime = new Date(`${selectedDateStr}T${hour}:${minute}:00`);
    const now = new Date();



    if (selectedDateTime <= now) {
      this.message.error('The appointment must be in the future.!');
      return;
    }

    const updatedAppointment: AppointmentDTO = {
      ...this.data,
      appointmentDate: selectedDateStr,
      appointmentTime: `${hour}:${minute}`,
      status: +this.editData.status
    };
    this.save.emit(updatedAppointment);
  }

  onCancel() {
    this.cancel.emit(); // Báo cho cha biết đã hủy
  }

  isDataChanged(): boolean {
    // Chuẩn hóa ngày về yyyy-MM-dd
    const normalizeDate = (date: any) => {
      if (!date) return '';
      if (typeof date === 'string') return date.slice(0, 10);
      // Nếu là Date object
      return date.toISOString().slice(0, 10);
    };

    // Chuẩn hóa giờ phút về HH:mm
    const normalizeTime = (time: any) => {
      if (!time) return '00:00';
      // Nếu có dạng HH:mm:ss thì lấy HH:mm
      return time.length > 5 ? time.slice(0, 5) : time;
    };

    const oldDate = normalizeDate(this.data.appointmentDate);
    const oldTime = normalizeTime(this.data.appointmentTime);
    const oldStatus = +this.data.status;

    const newDate = normalizeDate(this.editData.appointmentDate);
    const newTime = `${this.editData.hour}:${this.editData.minute}`;
    const newStatus = +this.editData.status;

    return (
      oldDate !== newDate ||
      oldTime !== newTime ||
      oldStatus !== newStatus
    );
  }

}
