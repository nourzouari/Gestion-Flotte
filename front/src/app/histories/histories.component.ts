import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HistoryService } from '../services/history.service';
import { History } from './history.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HistoriesRoutingModule } from '../histories/histories-routing.module';
import { Router } from '@angular/router';
import { DriverService } from '../services/driver.service';
import { NavbarComponent } from "../shared/navbar/navbar.component";

@Component({
  standalone: true,
  selector: 'app-histories',
  templateUrl: './histories.component.html',
  styleUrls: ['./histories.component.scss'],
imports: [
    CommonModule,
    ReactiveFormsModule, // ⚠️ Important
    HistoriesRoutingModule, ReactiveFormsModule,
    NavbarComponent
]})

export class HistoriesComponent implements OnInit {
  histories: History[] = [];
  historyForm!: FormGroup; // ✅ CHANGÉ ici
  drivers: any[] = [];
  errorMessage = '';
  loading = false;

  constructor(
  private historyService: HistoryService,
  private driverService: DriverService, // ✅
  private route: ActivatedRoute,
  private fb: FormBuilder,
  private router: Router
) {}

  ngOnInit(): void {
    this.historyForm = this.fb.group({
      type: ['accident', Validators.required],
      description: [''],
      date: ['', Validators.required],
      driver_id: [null, Validators.required]  // ✅ tu dois le déclarer aussi ici
    });

    this.loadHistories();
    this.loadDrivers(); // ✅ à ajouter
  }

  loadHistories() {
    this.historyService.getHistories().subscribe({
      next: (data) => {
        console.log('Data reçue:', data);
        this.histories = data;
      },
      error: (err) => console.error(err)
    });
  }

  // ✅ Méthode à ajouter pour remplir la liste déroulante des conducteurs
  loadDrivers() {
    // Tu dois avoir un service DriverService
    // Exemple (si tu as déjà DriverService injecté) :
    // this.driverService.getDrivers().subscribe(data => this.drivers = data);
  }

  onSubmit() {
    if (this.historyForm.invalid) {
      console.warn('❌ Formulaire invalide', this.historyForm.value);
      this.historyForm.markAllAsTouched();
      return;
    }

    const newHistory: Omit<History, 'id'> = this.historyForm.value;

    this.historyService.createHistory(newHistory).subscribe(() => {
      console.log('✅ Historique ajouté');
      this.router.navigate(['/histories']);
    });
  }

  editHistory(id: number) {
    this.router.navigate(['/histories/edit', id]);
  }

  delete(id: number) {
  const confirmation = confirm('Êtes-vous sûr de vouloir supprimer cet historique ?');
  
  if (confirmation) {
    this.historyService.deleteHistory(id).subscribe(() => this.loadHistories());
  }
}
}
