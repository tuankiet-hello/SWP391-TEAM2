import { CreatedMenstrualCycleComponent } from './created-menstrual-cycle/created-menstrual-cycle.component';
import { PredictViewComponent } from './predict-cycle/predict-cycle.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MenstrualCycleDTO,
  MenstrualService,
  Remind,
} from '../../../../services/menstrual-cycle.service';
import { AuthService } from '../../../../services/auth.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

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
    BaseChartDirective,
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
  pieChartData!: ChartData<'pie', number[], string | string[]>;
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: ' #1f2937', font: { size: 13 } },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const valueRaw = context.parsed;
            // Ép kiểu valueRaw thành number (nếu không phải số, gán 0)
            const value = typeof valueRaw === 'number' ? valueRaw : 0;

            const data = context.chart.data.datasets[0].data;
            const sum = (data as number[]).reduce(
              (a, b) => a + (typeof b === 'number' ? b : 0),
              0
            );
            const percentage = sum ? ((value / sum) * 100).toFixed(1) : '0';

            return `${label}: ${value} ngày (${percentage}%)`;
          },
        },
      },
    },
  };
  pieChartType: ChartType = 'pie';
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
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
    if (this.accountId) {
      this.mestrualCycleService.getLatestRemind(this.accountId).subscribe({
        next: (remind) => this.updateChart(remind),
        error: (err) => console.error('Lỗi khi lấy remind:', err),
      });
    }
  }
  updateChart(remind: Remind) {
    const cycleLength = 28;
    const menstruationDays = 5;

    const fertileStart = new Date(remind.fertileWindowStart);
    const fertileEnd = new Date(remind.fertileWindowEnd);
    const fertileDays =
      Math.floor(
        (fertileEnd.getTime() - fertileStart.getTime()) / (1000 * 3600 * 24)
      ) + 1;

    const ovulationDays = 1;
    const lowRiskDays =
      cycleLength - menstruationDays - fertileDays - ovulationDays;

    this.pieChartData = {
      labels: [
        'menstruationDays ',
        'ovulationDays ',
        ' fertileDays',
        'lowRiskDays ',
      ],
      datasets: [
        {
          data: [menstruationDays, ovulationDays, fertileDays, lowRiskDays],
          backgroundColor: ['#e57373', '#ffd54f', '#64b5f6', '#81c784'],
          hoverBackgroundColor: ['#ef5350', '#ffb300', '#1976d2', '#388e3c'],
        },
      ],
    };

    // Gọi update để biểu đồ render lại với dữ liệu mới
    this.chart?.update();
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

  //   pieChartData = {
  //     labels: ['Ngày có kinh', 'Ngày kết thúc', 'Ngày dễ có thai'],
  //     datasets: [{
  //       data: [10, 5, 15],
  //       backgroundColor: ['#4f46e5', '#6366f1', '#a78bfa'],
  //       hoverBackgroundColor: ['#4338ca', '#4f46e5', '#8b5cf6']
  //     }]
  //   };

  // pieChartOptions: ChartOptions<'pie'> = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: 'bottom',  // giá trị này hợp lệ
  //       labels: {
  //         font: {
  //           size: 13
  //         }
  //       }
  //     },
  //     tooltip: {
  //       enabled: true
  //     }
  //   }
  // };
}
