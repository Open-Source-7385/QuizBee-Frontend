import { Routes } from '@angular/router';
import { Layout } from './shared/presentation/components/layout/layout';
import { Home } from './shared/presentation/views/home/home';

const about = () => import('./shared/presentation/views/about/about').then(m => m.About);
const pageNotFound = () => import('./shared/presentation/views/page-not-found/page-not-found').then(m => m.PageNotFound);

const baseTitle = 'Quizbee';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        redirectTo: 'quizz',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: Home,
        title: `${baseTitle} - Home`
      },
      {
        path: 'about',
        loadComponent: about,
        title: `${baseTitle} - About`
      },
      {
        path: 'quizz/create',
        loadComponent: () => import('./quizzies/presentation/views/quizz-create/quizz-create')
          .then(m => m.QuizzCreate),
        title: `${baseTitle} - Quizz create`
      },
      {
        path: 'quizz',
        loadComponent: () => import('./quizzies/presentation/views/quizz-list/quizz-list')
          .then(m => m.QuizzList),
        title: `${baseTitle} - Quizzes`
      },
      {
        path: 'quizz/:id',
        loadComponent: () => import('./quizzies/presentation/views/quizz-play/quizz-play')
          .then(m => m.QuizzPlay),
        title: `${baseTitle} - Play Quiz`
      },
      {
        path: '**',
        loadComponent: pageNotFound,
        title: `${baseTitle} - Page Not Found`
      }

    ]
  }
];
