import {Routes} from "@angular/router";


export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Partnerek'
    },
    children: [
      {
        path: '',
        redirectTo: 'clients',
        pathMatch: 'full'
      },
      {
        path: 'client',
        loadComponent: () => import('./client/client.component').then(m => m.ClientComponent),
        data: {
          title: 'Megbízók'
        }
      },
      {
        path: 'company',
        loadComponent: () => import('./company/company.component').then(m => m.CompanyComponent),
        data: {
          title: 'Szennyező cég'
        }
      },
      {
        path: 'location',
        loadComponent: () => import('./location/location.component').then(m => m.LocationComponent),
        data: {
          title: 'Telephelyek'
        }
      },
      {
        path: 'laboratory',
        loadComponent: () => import('./laboratory/laboratory.component').then(m => m.LaboratoryComponent),
        data: {
          title: 'Laboratóriumok'
        }
      }
    ]
  }
];

