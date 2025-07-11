import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { provideNzConfig } from 'ng-zorro-antd/core/config';
import { provideAnimations } from '@angular/platform-browser/animations';

// ✅ Chart.js + ng2-charts cấu hình đúng cho v8
import { provideCharts } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// ✅ Đăng ký toàn bộ chart types + plugin datalabels
Chart.register(...registerables, ChartDataLabels);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
      })
    ),
    provideCharts(), // ✅ KHÔNG dùng withDefaultRegisterables() nữa
    provideHttpClient(),
    importProvidersFrom(BrowserAnimationsModule),
    provideAnimations(),
    { provide: NZ_I18N, useValue: en_US },
    provideNzConfig({}),
  ],
};

export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000',
};
