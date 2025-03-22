import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Laboratórium'
    },
    children: [
      {
        path: '',
        redirectTo: 'adjustment-method',
        pathMatch: 'full'
      },
      {
        path: 'adjustment-method',
        loadComponent: () => import('./adjustment-method/adjustment-method.component').then(m => m.AdjustmentMethodComponent),
        data: {
          title: 'Mintavételi beállítás'
        }
      },
      {
        path: 'contaminant-group',
        loadComponent: () => import('./contaminant-group/contaminant-group.component').then(m => m.ContaminantGroupComponent),
        data: {
          title: 'Szennyezőanyag csoport'
        }
      },
      {
        path: 'contaminant',
        loadComponent: () => import('./contaminant/contaminant.component').then(m => m.ContaminantComponent),
        data: {
          title: 'Szennyezőanyag'
        }
      },
      {
        path: 'equipment',
        loadComponent: () => import('./equipment/equipment.component').then(m => m.EquipmentComponent),
        data: {
          title: 'Eszközök'
        }
      },
      {
        path: 'measurement-unit',
        loadComponent: () => import('./measurement-unit/measurement-unit.component').then(m => m.MeasurementUnitComponent),
        data: {
          title: 'Mértékegységek'
        }
      },
      {
        path: 'sampling-type',
        loadComponent: () => import('./sampling-type/sampling-type.component').then(m => m.SamplingTypeComponent),
        data: {
          title: 'Mintavételi típusok'
        }
      },
      {
        path: 'standard',
        loadComponent: () => import('./standard/standard.component').then(m => m.StandardComponent),
        data: {
          title: 'Szabványok'
        }
      }
    ]
  }
];

