import { Routes } from '@angular/router';

const rankingGlobal = () => import('./ranking-global/ranking-global').then(m => m.RankingGlobalComponent);
const rankingLevel = () => import('./ranking-level/ranking-level').then(m => m.RankingLevelComponent);
const rankingCountry = () => import('./ranking-country/ranking-country').then(m => m.RankingCountryComponent);
const rankingUser = () => import('./ranking-user/ranking-user').then(m => m.RankingUserComponent);



export const rankingRoutes: Routes = [
  { path: 'ranking/global', loadComponent: rankingGlobal },
  { path: 'ranking/level/:level', loadComponent: rankingLevel },
  { path: 'ranking/country/:country', loadComponent: rankingCountry },
  { path: 'ranking/user', loadComponent: rankingUser }
];
