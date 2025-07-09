import { CreatedMenstrualCycleComponent } from './created-menstrual-cycle/created-menstrual-cycle.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenstrualCycleDTO, MenstrualService } from '../../../../services/menstrual-cycle.service';
import { AuthService } from '../../../../services/auth.service';
interface MenstrualCycle {
  start_date: string; // ISO date string
  end_date: string;
  note?: string;
}

@Component({
  selector: 'app-menstrual-cycle',
  imports: [CommonModule,
    FormsModule, CreatedMenstrualCycleComponent],
  templateUrl: './menstrual-cycle.component.html',
  styleUrls: ['./menstrual-cycle.component.css']
})

export class MenstrualCycleComponent implements OnInit {
  cycles: MenstrualCycleDTO[] = [];
  showForm = false;
  editingCycle: MenstrualCycle | null = null;
  form: MenstrualCycle = { start_date: '', end_date: '', note: '' };
  prediction: any = null;

  constructor(
    private authService: AuthService,
    private mestrualCycleService: MenstrualService
  ) { }

  ngOnInit() {
    const accountId = this.authService.getIdFromToken();
    if (accountId) {
      this.mestrualCycleService.getCycleByAccId(accountId).subscribe(data => {
        this.cycles = data;
      });
    } else {
      console.error('Không tìm thấy accountId');
    }
  }
  openAddForm() {
    this.editingCycle = null;
    this.form = { start_date: '', end_date: '', note: '' };
    this.showForm = true;
  }

  openEditForm(cycle: MenstrualCycle) {
    this.editingCycle = cycle;
    this.form = { ...cycle };
    this.showForm = true;
  }


  // Các hàm khác như openAddForm, openEditForm, handleSaveCycle...

  handleCancelForm() {
    this.showForm = false;
    this.editingCycle = null;
  }
  cancelForm() {
    this.showForm = false;
    this.editingCycle = null;
  }
  handleSaveCycle(cycle: MenstrualCycleDTO) {
  const accountId = this.authService.getIdFromToken();

  if (!accountId) {
    alert('Không tìm thấy tài khoản, vui lòng đăng nhập lại.');
    return;
  }

  // Gán accountID vào cycle
  cycle.accountID = accountId;

  if (this.editingCycle) {
    // TODO: xử lý cập nhật chu kỳ
  } else {
    this.mestrualCycleService.createCycle(cycle).subscribe({
      next: (res) => {
        alert(res.message);
        this.cycles.push(cycle);
        this.showForm = false;
      },
      error: (err) => {
        console.error('Lỗi khi tạo chu kỳ:', err);
        alert('Tạo chu kỳ thất bại, vui lòng thử lại.');
      }
    });
  }
}


  predictCycle() {
    if (this.cycles.length < 2) {
      alert('Cần ít nhất 2 chu kỳ để dự đoán.');
      return;
    }

    // Chuyển ngày string sang Date
    const sortedCycles = [...this.cycles].sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

    // Tính độ dài chu kỳ
    const cycleLengths: number[] = [];
    for (let i = 1; i < sortedCycles.length; i++) {
      const prev = new Date(sortedCycles[i - 1].start_date);
      const curr = new Date(sortedCycles[i].start_date);
      cycleLengths.push((curr.getTime() - prev.getTime()) / (1000 * 3600 * 24));
    }
    const avgLength = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length;

    const lastCycle = sortedCycles[sortedCycles.length - 1];
    const predictedStart = new Date(lastCycle.start_date);
    predictedStart.setDate(predictedStart.getDate() + avgLength);

    const predictedOvulation = new Date(predictedStart);
    predictedOvulation.setDate(predictedOvulation.getDate() - 14);

    this.prediction = {
      PredictedStartDate: predictedStart,
      PredictedOvulationDate: predictedOvulation,
      FertileWindow: [
        new Date(predictedOvulation.getTime() - 5 * 24 * 60 * 60 * 1000),
        new Date(predictedOvulation.getTime() + 1 * 24 * 60 * 60 * 1000)
      ]
    };
  }
}
