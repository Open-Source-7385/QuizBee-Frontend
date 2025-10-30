import { Routes } from '@angular/router';
import { Layout } from './shared/presentation/components/layout/layout';
import { Home } from './shared/presentation/views/home/home';
import {PlanSelectionComponent} from './plans/presentation/views/plan-selection/plan-selection.component';
import {PaymentProcessComponent} from './plans/presentation/views/payment-process/payment-process.component';
import {
  ManageSubscriptionComponent
} from './plans/presentation/views/manage-subscription/manage-subscription.component';
import {InvoiceHistoryComponent} from './plans/presentation/views/invoice-history/invoice-history.component';
import {InvoiceDetailComponent} from './plans/presentation/views/invoice-detail/invoice-detail.component';
import {MyCreationsComponent} from './quizzies/presentation/views/my-creations/my-creations';
import {EditQuizComponent} from './quizzies/presentation/views/edit-quiz/edit-quiz';

const about = () => import('./shared/presentation/views/about/about').then(m => m.About);
const pageNotFound = () => import('./shared/presentation/views/page-not-found/page-not-found').then(m => m.PageNotFound);
const baseTitle = 'Quizbee';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./profile/presentation/views/login/login').then(m => m.Login),
    title: `${baseTitle} - Login`
  },
  {
    path: 'register',
    loadComponent: () => import('./profile/presentation/views/register/register').then(m => m.Register),
    title: `${baseTitle} - Registro`
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/presentation/views/profile/profile').then(m => m.ProfileView),
        title: `${baseTitle} - Perfil`
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
        path: 'creaciones',
        component: MyCreationsComponent,
        title: `${baseTitle} - Creationes`
      },
      {
        path: 'plans',
        component: PlanSelectionComponent,
        title: `${baseTitle} - Planes`
      },
      {
        path: 'payment',
        component: PaymentProcessComponent,
        title: `${baseTitle} - Pago`
      },
      {
        path: 'manage-subscription',
        component: ManageSubscriptionComponent,
        title: `${baseTitle} - Gestionar Suscripción`
      },
      {
        path: 'invoice-history',
        component: InvoiceHistoryComponent,
        title: `${baseTitle} - Historial de Facturas`
      },
      {
        path: 'invoice-detail/:id',
        component: InvoiceDetailComponent,
        title: `${baseTitle} - Detalle de Factura`
      },
      { path: 'quizz/edit/:id',
        component: EditQuizComponent,
        title: `${baseTitle} - edit`
      } ,

      {
        path: '**',
        loadComponent: pageNotFound,
        title: `${baseTitle} - Page Not Found`
      }

    ]
  }
];
