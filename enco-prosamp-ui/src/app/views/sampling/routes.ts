import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Mintavétel'
    },
    children: [
      {
        path: '',
        redirectTo: 'Mintavétel',
        pathMatch: 'full'
      },
      {
        path: 'sampling-record-datm200',
        loadComponent: () => import('./sampling-record-datm200/sampling-record-datm200.component').then(m => m.SamplingRecordDatm200Component),
        data: {
          title: 'Mintavételi jegyzőkönyv'
        }
      },
      {
        path: 'samples',
        loadComponent: () => import('./samples/samples.component').then(m => m.SamplesComponent),
        data: {
          title: 'Minták'
        }
      }
    ]
  }
];

