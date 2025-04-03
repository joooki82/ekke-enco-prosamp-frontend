import {Routes} from "@angular/router";
import {DefaultLayoutComponent} from "./layout";
import {canActivateAuthRole} from "./guards/auth-role.guard";


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
    // canActivate: [canActivateAuthRole],
    // data: { role: 'managing_director' }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    // canActivate: [canActivateAuthRole],
    // data: {
    //   title: 'Home',
    //   role: 'view-books'
    // },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes),
        // canActivate: [canActivateAuthRole],
        // data: { role: 'managing_director' }
      },

      {
        path: 'analytics',
        loadChildren: () => import('./views/analytics/routes').then((m) => m.routes),
        // canActivate: [canActivateAuthRole],
        // data: { role: 'managing_director' }
      },
      {
        path: 'laboratorium',
        loadChildren: () => import('./views/laboratory/routes').then((m) => m.routes),
        canActivate: [canActivateAuthRole],
        data: { role: 'managing_director' }
      },
      {
        path: 'partners',
        loadChildren: () => import('./views/partners/routes').then((m) => m.routes),
        // canActivate: [canActivateAuthRole],
      },
      {
        path: 'projects',
        loadChildren: () => import('./views/projects/routes').then((m) => m.routes),
        // canActivate: [canActivateAuthRole],
      },
      {
        path: 'sampling',
        loadChildren: () => import('./views/sampling/routes').then((m) => m.routes),
        // canActivate: [canActivateAuthRole],
      },
      {
        path: 'reports',
        loadChildren: () => import('./views/reports/routes').then((m) => m.routes),
        // canActivate: [canActivateAuthRole],
      },
    ]
  },
  {path: '**', redirectTo: 'dashboard'}
];
