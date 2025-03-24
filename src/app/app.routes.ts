
import { Routes } from '@angular/router';
import {ServicesComponent } from './components/services/services.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginstaffComponent } from './components/loginstaff/loginstaff.component';
import { RegisterComponent } from './components/register/register.component';
import { MecaniciensComponent } from './components/mecaniciens/mecaniciens.component';
import { TypevehiculesComponent } from './components/typevehicules/typevehicules.component';
import { MesvehiculesComponent } from './components/mesvehicules/mesvehicules.component';
export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
        // { path: 'services', component: ServicesComponent },
        { path: 'services', component: ServicesComponent, canActivate: [AuthGuard], data: { roles: ['mecanicien', 'manager','client'] } }, // Exemple Mecaniciens et Manager
        { path: 'mecaniciens', component: MecaniciensComponent, canActivate: [AuthGuard], data: { roles : ['manager']} },
        { path: 'typevehicules', component: TypevehiculesComponent, canActivate: [AuthGuard], data: {roles : ['manager']} },
        { path: 'mesvehicules', component: MesvehiculesComponent, canActivate: [AuthGuard], data: {roles : ['client']} },
        { path: '', redirectTo: 'services', pathMatch: 'full' },
        ],
    },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
          { path: 'login', component: LoginComponent },
          { path: 'register', component : RegisterComponent},
          { path : 'loginstaff', component : LoginstaffComponent}
        ],
      },
    { path: '**', redirectTo: '' }
];
