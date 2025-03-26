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
      },
      {
        path: 'sample-analytical-result',
        loadComponent: () => import('./sample-analytical-result/sample-analytical-result.component').then(m => m.SampleAnalyticalResultComponent),
        data: {
          title: 'Vizsgálati eredmények'
        }
      }
    ]
  }
];

