import { CreatedMenstrualCycleComponent } from './created-menstrual-cycle/created-menstrual-cycle.component';
import { PredictViewComponent } from './predict-cycle/predict-cycle.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MenstrualCycleDTO,
  MenstrualService,
} from '../../../../services/menstrual-cycle.service';
import { AuthService } from '../../../../services/auth.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartOptions } from 'chart.js';

interface MenstrualCycle {
  start_date: string; // ISO date string
  end_date: string;
  note?: string;
}

@Component({
  selector: 'app-menstrual-cycle',
  imports: [
    CommonModule,
    FormsModule,
    CreatedMenstrualCycleComponent,
    PredictViewComponent,
    HeaderComponent,
    FooterComponent,
    BaseChartDirective
  ],
   providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './menstrual-cycle.component.html',
  styleUrls: ['./menstrual-cycle.component.css'],
})
export class MenstrualCycleComponent implements OnInit {
  cycles: MenstrualCycleDTO[] = [];
  showForm = false;
  showFormPredict = false;
  editingCycle: MenstrualCycle | null = null;
  form: MenstrualCycle = { start_date: '', end_date: '', note: '' };
  prediction: any = null;
  selectMode: string = 'new';
  cycle!: MenstrualCycleDTO;
  accountId!: string;
  predict!: any;
  constructor(
    private authService: AuthService,
    private mestrualCycleService: MenstrualService
  ) {}

  ngOnInit() {
    this.accountId = this.authService.getIdFromToken();
    if (this.accountId) {
      this.mestrualCycleService
        .getCycleByAccId(this.accountId)
        .subscribe((data) => {
          this.cycles = data;
        });
    } else {
      console.error('Không tìm thấy accountId');
    }
  }
  openAddForm() {
    this.selectMode = 'new';
    this.showForm = true;
  }

  openEditForm(cycle: MenstrualCycleDTO) {
    this.cycle = cycle;
    this.selectMode = 'edit';
    this.showForm = true;
  }

  // Các hàm khác như openAddForm, openEditForm, handleSaveCycle...

  handleCancelForm() {
    this.showFormPredict = false;
    this.showForm = false;
    this.editingCycle = null;
  }
  cancelForm() {
    this.showForm = false;
    this.editingCycle = null;
  }
  openPredict() {
    this.predictCycle();
  }
  // handleSaveCycle() {
  //   const accountId = this.authService.getIdFromToken();

  //   if (!accountId) {
  //     alert('Không tìm thấy tài khoản, vui lòng đăng nhập lại.');
  //     return;
  //   }
  //   const cycle = {
  //     accountID: accountId,
  //     start_date: this.form.start_date,
  //     end_date: this.form.end_date,
  //     note: this.form.note,
  //     reminder_enabled: true,
  //   };
  //   // Gán accountID vào cycle

  //   if (this.editingCycle) {
  //     // TODO: xử lý cập nhật chu kỳ
  //   } else {
  //     this.mestrualCycleService.createCycle(cycle).subscribe({
  //       next: (res) => {
  //         // alert(res.message);
  //         this.cycles.push(cycle);
  //         this.showForm = false;
  //       },
  //       error: (err) => {
  //         console.error('Lỗi khi tạo chu kỳ:', err);
  //         alert('Tạo chu kỳ thất bại, vui lòng thử lại.');
  //       },
  //     });
  //   }
  // }
  loadCycles() {
    this.mestrualCycleService
      .getCycleByAccId(this.accountId)
      .subscribe((data) => {
        this.cycles = data;
      });
  }

  predictCycle() {
    if (this.cycles.length < 2) {
      alert('Cần ít nhất 2 chu kỳ để dự đoán.');
      return;
    }

    this.mestrualCycleService.predictCycle(this.accountId).subscribe({
      next: (res) => {
        // alert(res.message);
        this.predict = res;
        console.log(this.predict);
        this.showFormPredict = true;
      },
      error: (err) => {
        console.error('Lỗi khi dự đoán chu kỳ:', err);
        alert('Tạo dự đoán chu kỳ thất bại, vui lòng thử lại.');
      },
    });
  }

  remindCycle() {
    if (this.cycles.length < 2) {
      alert('Cần ít nhất 2 chu kỳ để dự đoán.');
      return;
    }

    this.mestrualCycleService.remindCycle(this.accountId).subscribe({
      next: (res) => {
        // alert(res.message);
        console.log('thành công nhắc');
        console.log(res);
      },
      error: (err) => {
        console.error('Lỗi khi nhắc đoán chu kỳ:', err);
        alert('nhắc dự đoán chu kỳ thất bại, vui lòng thử lại.');
      },
    });
  }
  
    pieChartData = {
      labels: ['Ngày có kinh', 'Ngày kết thúc', 'Ngày dễ có thai'],
      datasets: [{
        data: [10, 5, 15],
        backgroundColor: ['#4f46e5', '#6366f1', '#a78bfa'],
        hoverBackgroundColor: ['#4338ca', '#4f46e5', '#8b5cf6']
      }]
    };
  
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',  // giá trị này hợp lệ
        labels: {
          font: {
            size: 13
          }
        }
      },
      tooltip: {
        enabled: true
      }
    }
  };
  
}
