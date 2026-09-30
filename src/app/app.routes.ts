import { Routes } from '@angular/router';
import { APP_INFO_DEFAULTS } from './app-info';

export const routes: Routes = [
  {
    path: '',
    title: APP_INFO_DEFAULTS.name,
    loadComponent: () => import('./home/home').then((m) => m.Home),
  },
  { path: '**', redirectTo: '' },
];
