import { Routes } from '@angular/router';
import {Layout} from './shared/presentation/components/layout/layout';
import {Home} from './shared/presentation/views/home/home';
import { rankingRoutes } from './ranking/presentation/views/ranking.routes';

const about = () => import('./shared/presentation/views/about/about').then(m => m.About);
const pageNotFound = () => import('./shared/presentation/views/page-not-found/page-not-found').then(m => m.PageNotFound);
const baseTitle = 'Quizbee';
export const routes: Routes = [
  { path: 'home', component: Home, title: `${baseTitle} - Home`  },
  { path: 'about', loadComponent: about, title: `${baseTitle} - About`  },
  { path: '', redirectTo: '/home', pathMatch: 'full'  },
  { path: '**', loadComponent:  pageNotFound, title: `${baseTitle} - Page Not Found`  },
  { path: 'ranking', loadChildren: () => import('./ranking/presentation/views/ranking.routes').then(m => m.rankingRoutes) },
  ];
