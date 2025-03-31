import {Routes} from "@angular/router";
import {DefaultLayoutComponent} from "./layout";
import {canActivateAuthRole} from "./guards/auth-role.guard";


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'analytics',
        loadChildren: () => import('./views/analytics/routes').then((m) => m.routes)
      },
      {
        path: 'laboratorium',
        loadChildren: () => import('./views/laboratory/routes').then((m) => m.routes)
      },
      {
        path: 'partners',
        loadChildren: () => import('./views/partners/routes').then((m) => m.routes)
      },
      {
        path: 'projects',
        loadChildren: () => import('./views/projects/routes').then((m) => m.routes)
      },
      {
        path: 'sampling',
        loadChildren: () => import('./views/sampling/routes').then((m) => m.routes)
      },
      {
        path: 'reports',
        loadChildren: () => import('./views/reports/routes').then((m) => m.routes)
      },
    ]
  },
  {path: '**', redirectTo: 'dashboard'}
];
