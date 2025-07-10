import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./driver-list/driver-list.component').then(m => m.DriverListComponent)
  },
  {
    path: 'add',
    loadComponent: () => import('./driver-form/driver-form.component').then(m => m.DriverFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./driver-form/driver-form.component').then(m => m.DriverFormComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriversRoutingModule {}
