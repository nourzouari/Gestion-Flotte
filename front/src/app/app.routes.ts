import { Routes } from '@angular/router';
import {VehicleFormComponent} from './vehicles/vehicle-form/vehicle-form.component'
import { AuthGuard } from './auth.guard'; // Importez votre guard d'authentification
import { LoginComponent } from './login/login.component';
//import { SignupComponent } from './auth/signup/signup.component';
//import { GoogleAuthCallbackComponent } from './auth/google-auth-callback/google-auth-callback.component';
import {VehicleAssignmentComponent} from './vehicle-assignment/vehicle-assignment.component';
import {VehicleAvailabilityComponent} from './vehicle-availability/vehicle-availability.component';

export const routes: Routes = [
 
  {
    path: 'login',
    component: LoginComponent
  },

{
  path: 'profile',
  loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
},


{
    path: 'vehicle-availability',
    loadComponent: () =>
      import('./vehicle-availability/vehicle-availability.component')
        .then(m => m.VehicleAvailabilityComponent)
  },
   
// Assignations
  {
  path: 'assign-vehicle',
  loadComponent: () =>
    import('./vehicle-assignment/vehicle-assignment.component')
      .then(m => m.VehicleAssignmentComponent)
},
{
  path: 'assignments',
  loadComponent: () => import('./vehicle-assignment/assignments-list/assignments-list.component').then(c => c.AssignmentsListComponent)
},
{
  path: 'assign-vehicle/:id',
  loadComponent: () =>
    import('./vehicle-assignment/vehicle-assignment.component').then(m => m.VehicleAssignmentComponent)
},
   
   {
  path: 'vehicles',
  children: [
    {
      path: '',
      loadComponent: () => import('./vehicles/vehicles.component').then(m => m.VehiclesComponent)
    },
    {
      path: 'new',
      loadComponent: () => import('./vehicles/vehicle-form/vehicle-form.component').then(m => m.VehicleFormComponent)
    },
    {
      path: 'edit/:id',
      loadComponent: () => import('./vehicles/vehicle-form/vehicle-form.component').then(m => m.VehicleFormComponent)
    }
  ]
},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'drivers',
    loadComponent: () =>
      import('./drivers/drivers.component').then(m => m.DriversComponent)
  },
  {
    path: 'drivers/new',
    loadComponent: () =>
      import('./drivers/driver-form/driver-form.component').then(m => m.DriverFormComponent)
  },
  {
    path: 'drivers/edit/:id',
    loadComponent: () =>
      import('./drivers/driver-form/driver-form.component').then(m => m.DriverFormComponent)
  },

  {
    path: 'histories',
    loadComponent: () =>
      import('./histories/histories.component').then(m => m.HistoriesComponent)
  },
  {
    path: 'histories/new',
    loadComponent: () =>
      import('./histories/history-form/history-form.component').then(m => m.HistoryFormComponent)
  },
  {
    path: 'histories/edit/:id',
    loadComponent: () =>
      import('./histories/history-form/history-form.component').then(m => m.HistoryFormComponent)
  },
  {
    path: 'drivers/:id/histories',
    loadComponent: () =>
      import('./histories/histories.component').then(m => m.HistoriesComponent)
  },

  { path: '**', redirectTo: '' }
];
