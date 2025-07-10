import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoriesComponent } from './histories.component';
import { HistoryFormComponent } from './history-form/history-form.component';

const routes: Routes = [
  // Affiche la liste de tous les historiques
  { path: '', component: HistoriesComponent },

  // Formulaire pour ajouter un historique
  { path: 'new', component: HistoryFormComponent },

  // Liste des historiques d’un conducteur spécifique (doit être placé après 'new')
  { path: 'driver/:id', component: HistoriesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoriesRoutingModule {}