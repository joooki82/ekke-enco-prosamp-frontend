import {Routes} from "@angular/router";


export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Analitika'
    },
    children: [
      {
        path: '',
        redirectTo: 'analytics',
        pathMatch: 'full'
      },
      {
        path: 'sample-contaminant-link',
        loadComponent: () => import('./sample-contaminant-link/sample-contaminant-link.component').then(m => m.SampleContaminantLinkComponent),
        data: {
          title: 'Vizsgálandó szennyezők'
        }
      }
    ]
  }
];

