
import { Routes } from '@angular/router';
import {ServicesComponent } from './components/services/services.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './components/login/login.component';
export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
        { path: 'services', component: ServicesComponent },
        { path: '', redirectTo: 'services', pathMatch: 'full' },
        ],
    },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
          { path: 'login', component: LoginComponent },
        ],
      },
    { path: '**', redirectTo: '' }
];
