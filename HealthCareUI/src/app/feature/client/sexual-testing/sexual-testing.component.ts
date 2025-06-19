import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentCardComponent } from '../../../../app/shared/components/appointment-card/appointment-card.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
@Component({
  selector: 'app-sexual-testing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AppointmentCardComponent,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './sexual-testing.component.html',
  styleUrls: ['./sexual-testing.component.css'],
})
export class SexualTestingComponent {
  search: string = '';

  tests = [
    {
      imageUrl: 'assets/xet-nghiem-dieu-tri-lau.jpg',
      title: 'Xét nghiệm bệnh lậu',
      price: '170.000 VNĐ',
    },
    {
      imageUrl: 'assets/xet-nghiem-dieu-tri-sui-mao-ga.jpg',
      title: 'Xét nghiệm sùi mào gà HPV',
      price: '100.000 VNĐ',
    },
    {
      imageUrl: 'assets/xet-nghiem-dieu-tri-mun-rop-sinh-duc-1.jpg',
      title: 'Mụn rộp sinh dục HSV',
      price: '250.000 VNĐ',
    },
    {
      imageUrl: 'assets/xet-nghiem-dieu-tri-chlamydia.jpg',
      title: 'Xét nghiệm Chlamydia',
      price: '100.000 VNĐ',
    },
    {
      imageUrl: 'assets/Xet-nghiem-hiv-combo.jpg',
      title: 'Compo Xét Nghiệm HIV',
      price: '169.000 VNĐ',
    },
    {
      imageUrl: 'assets/xn-giang-mai.jpg',
      title: 'Xét nghiệm Giang Mai',
      price: '100.000 VNĐ',
    },
    // ...
  ];

  filteredTests = computed(() =>
    this.tests.filter((t) =>
      t.title.toLowerCase().includes(this.search.toLowerCase())
    )
  );
}
