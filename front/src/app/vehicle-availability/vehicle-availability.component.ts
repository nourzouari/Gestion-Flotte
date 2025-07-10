import { Component,OnDestroy  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleService } from '../services/vehicle.service';
import { Vehicle } from '../vehicles/vehicle.model';
import { Driver } from '../drivers/driver.model';
import { Subscription } from 'rxjs';

import { NgIf, NgFor, JsonPipe } from '@angular/common';

// Angular Material modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule }  from '@angular/material/button';
import { MatIconModule }    from '@angular/material/icon';
import { MatCardModule }    from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatTableModule }     from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavbarComponent } from "../shared/navbar/navbar.component";

@Component({
  selector: 'app-vehicle-availability',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // Material
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatProgressSpinnerModule,
    NavbarComponent
],
  templateUrl: './vehicle-availability.component.html',
  styleUrls: ['./vehicle-availability.component.scss']
})
export class VehicleAvailabilityComponent {
private subscription!: Subscription; // <-- "!" indique qu'elle sera initialisée plus tard

  form: FormGroup;
  vehicles: Vehicle[] = [];
  drivers: Driver[] = [];

  loading = false;
  errorMessage = '';
  /** colonnes affichées dans le tableau Material */
  displayedColumns: string[] = ['registration_number', 'brand', 'model', 'year'];

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService
  ) {
    this.form = this.fb.group({
  startDate: ['', Validators.required],
  endDate: ['', Validators.required],

});

  }
private formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mois de 1 à 12
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
}
   onSubmit() {
    if (this.form.invalid) {
      this.errorMessage = 'Veuillez remplir toutes les dates.';
      return;
    }

    const startDate = this.formatDate(new Date(this.form.value.startDate));
    const endDate = this.formatDate(new Date(this.form.value.endDate));

    if (isNaN(new Date(startDate).getTime()) || isNaN(new Date(endDate).getTime())) {
      this.errorMessage = 'Dates invalides.';
      return;
    }

    this.errorMessage = '';
    this.loading = true;
    this.vehicles = [];

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.vehicleService
      .getAvailableVehiclesBetweenDates(startDate, endDate)
      .subscribe({
        next: (data) => {
          this.vehicles = data;
          this.loading = false;
          this.errorMessage = data.length ? '' : 'Aucun véhicule disponible.';
        },
        error: (err) => {
          console.error('Erreur API:', err);
          this.errorMessage = 'Erreur lors de la récupération des véhicules.';
          this.loading = false;
        }
      });
  }
    ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
