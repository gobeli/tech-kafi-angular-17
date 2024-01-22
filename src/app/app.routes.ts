import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./trip-search-form/trip-search-form.component').then(m => m.TripSearchFormComponent)
  },
  {
    path: 'trip',
    loadComponent: () => import('./trip/trip.component').then(m => m.TripComponent)
  },
  {
    path: 'demo',
    loadComponent: () => import('./demo/demo.component').then(m => m.DemoComponent)
  },
  {
    path: 'demo/control-flow',
    loadComponent: () => import('./demo/control-flow/control-flow.component').then(m => m.ControlFlowComponent)
  }
];
