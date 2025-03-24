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
        path: 'sampling-record-dat-m200',
        loadComponent: () => import('./sampling-record-dat-m200/sampling-record-dat-m200.component').then(m => m.SamplingRecordDatM200Component),
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

