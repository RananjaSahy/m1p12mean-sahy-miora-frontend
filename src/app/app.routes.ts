
import { Routes } from '@angular/router';
import {ServicesComponent } from './components/services/services.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginstaffComponent } from './components/loginstaff/loginstaff.component';
import { RegisterComponent } from './components/register/register.component';
import { RendezvousComponent } from './components/rendezvous/rendezvous.component';
import { MecaniciensComponent } from './components/mecaniciens/mecaniciens.component';
import { TypevehiculesComponent } from './components/typevehicules/typevehicules.component';
import { MesvehiculesComponent } from './components/mesvehicules/mesvehicules.component';
import { RendezvousManagerComponent } from './components/rendezvous-manager/rendezvous-manager.component';
import { MesactionsComponent } from './components/mesactions/mesactions.component';
import { ActionComponent } from './components/action/action.component';
import { StatistiqueComponent } from './components/statistique/statistique.component';
import { ClientDetailComponent } from './components/clientdetail/clientdetail.component';
import { FactureComponent } from './components/facture/facture.component';
export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
        // { path: 'services', component: ServicesComponent },
        { path: 'services', component: ServicesComponent, canActivate: [AuthGuard], data: { roles: ['mecanicien', 'manager','client'] } }, // Exemple Mecaniciens et Manager
        { path: 'rendezvous', component: RendezvousComponent, canActivate: [AuthGuard], data: { roles: ['client'] } },
        { path: 'mecaniciens', component: MecaniciensComponent, canActivate: [AuthGuard], data: { roles : ['manager']} },
        { path: 'typevehicules', component: TypevehiculesComponent, canActivate: [AuthGuard], data: {roles : ['manager']} },
        { path: 'mesvehicules', component: MesvehiculesComponent, canActivate: [AuthGuard], data: {roles : ['client']} },
        { path: 'rendezvousManagers', component: RendezvousManagerComponent, canActivate: [AuthGuard], data: {roles : ['manager']} },
        { path: 'mesactions', component: MesactionsComponent, canActivate: [AuthGuard], data: {roles : ['client']} },
        { path: 'occupation', component: StatistiqueComponent, canActivate: [AuthGuard], data: {roles : ['manager']} },
        { path: 'task', component: ActionComponent, canActivate: [AuthGuard], data: {roles : ['manager']} },
        { path: 'task/:id', component: ActionComponent, canActivate: [AuthGuard], data: {roles : ['manager']} },
        { path: 'clients', component: ClientDetailComponent ,canActivate: [AuthGuard], data: {roles : ['manager']} },
        { path: 'clients/:id', component: ClientDetailComponent ,canActivate: [AuthGuard], data: {roles : ['manager']} },
        { path: 'facture/:id', component: FactureComponent ,canActivate: [AuthGuard], data: {roles : ['manager']} },
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
