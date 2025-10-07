import {Routes} from '@angular/router';

const rankingList = () => import('./ranking-list/ranking-list').then(m => m.RankingList);
const rankingDetail = () => import('./ranking-detail/ranking-detail').then(m => m.RankingDetail);

export const rankingRoutes: Routes = [
  { path: 'rankings', loadComponent: rankingList },
  { path: 'rankings/user/:userId', loadComponent: rankingDetail }
];
