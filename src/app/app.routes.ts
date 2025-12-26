import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Signup } from './auth/signup/signup';
import { Dashboard } from './dashboard/dashboard';
import { APP_ROUTES, authGuard } from './shared';

export const routes: Routes = [
  {
    path: '',
    redirectTo: `${APP_ROUTES.auth}/${APP_ROUTES.login}`,
    pathMatch: 'full',
  },
  {
    path: APP_ROUTES.auth,
    children: [
      {
        path: APP_ROUTES.login,
        component: Login,
        canActivate: [authGuard],
      },
      {
        path: APP_ROUTES.signup,
        component: Signup,
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: APP_ROUTES.dashboard,
    component: Dashboard,
    canActivate: [authGuard],
  },
  // {
  //   path: '**',
  //   canActivate: [authGuard],
  //   redirectTo: 'auth/login',
  // },
];
