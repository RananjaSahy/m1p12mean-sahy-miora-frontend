
import { Routes } from '@angular/router';
import {ServicesComponent } from './components/services/services.component';
export const routes: Routes = [
 { path: 'services', component: ServicesComponent },
 { path: '', redirectTo: 'services', pathMatch: 'full' }
];
