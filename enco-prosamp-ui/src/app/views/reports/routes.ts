import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Jegyzőkönyvek'
    },
    children: [
      {
        path: '',
        redirectTo: 'Jegyzőkönyvek',
        pathMatch: 'full'
      },
      {
        path: 'analytical-lab-report',
        loadComponent: () => import('./analytical-lab-report/analytical-lab-report.component').then(m => m.AnalyticalLabReportComponent),
        data: {
          title: 'Analitikai jegyzőkönyvek'
        }
      },
      {
        path: 'test-report',
        loadComponent: () => import('./test-report/test-report.component').then(m => m.TestReportComponent),
        data: {
          title: 'Vizsgálati jegyzőkönyvek'
        }
      }
    ]
  }
];

