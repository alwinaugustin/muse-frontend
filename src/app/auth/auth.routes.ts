import { RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
//import { LogoutComponent } from './components/logout/logout.component';

/**
 * Authentication Routes
 */
export const AuthRoutes = RouterModule.forChild([
    {
        path: '',
        redirectTo: '/album',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent,
        data: {title: 'Login'},
    }
]);
