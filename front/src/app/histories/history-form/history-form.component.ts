import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HistoryService } from '../../services/history.service';
import { History } from '../history.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Driver } from '../../drivers/driver.model';            // ✅ Chemin corrigé si besoin
import { DriverService } from '../../services/driver.service';
import { Validators } from '@angular/forms';
import { Vehicle } from '../../vehicles/vehicle.model';            // ✅ Chemin corrigé si besoin
import { VehicleService } from '../../services/vehicle.service';            // ✅ Chemin corrigé si besoin


@Component({
  selector: 'app-history-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './history-form.component.html',
  styleUrls: ['./history-form.component.scss']
})

export class HistoryFormComponent implements OnInit {
  historyForm!: FormGroup;
  drivers: Driver[] = [];
  vehicles: Vehicle[] = [];
  isEditMode = false;
  historyId?: number;


 constructor(
    private fb: FormBuilder,
    private historyService: HistoryService,
    private driverService: DriverService,
    private vehicleService: VehicleService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

ngOnInit(): void {
    this.historyForm = this.fb.group({
      type: ['Accident', Validators.required],
      description: [''],
      date: ['', Validators.required],
      driver_id: ['', Validators.required],
      vehicle_id: ['', Validators.required],  // rendu obligatoire
      
    });

    this.driverService.getDrivers().subscribe(data => this.drivers = data);
    this.vehicleService.getVehicles().subscribe(data => this.vehicles = data);

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.historyId = +id;
        this.loadHistory(this.historyId);
      }
    });
  }

  loadHistory(id: number) {
    this.historyService.getHistoryById(id).subscribe(history => {
      this.historyForm.patchValue({
        type: history.type,
        description: history.description,
        date: history.date,
        driver_id: history.driver_id,
        vehicle_id: history.vehicle_id,
        
      });
    });
  }

  onSubmit(): void {
    if (this.historyForm.invalid) {
      console.warn('Formulaire invalide', this.historyForm.value);
      this.historyForm.markAllAsTouched();
      return;
    }

    const formValue = this.historyForm.value;

    const historyData: Omit<History, 'id'> = {
      type: formValue.type,
      description: formValue.description,
      date: formValue.date,
      driver_id: formValue.driver_id,
      vehicle_id: formValue.vehicle_id,
      
    };

    if (this.isEditMode && this.historyId) {
      this.historyService.updateHistory(this.historyId, historyData).subscribe({
        next: () => {
          console.log('Historique modifié');
          this.router.navigate(['/histories']);
        },
        error: (err) => {
          console.error('Erreur modification historique :', err);
          if (err.status === 422 && err.error.errors) {
            console.error('Détails validation :', err.error.errors);
          }
        }
      });
    } else {
      this.historyService.createHistory(historyData).subscribe({
        next: () => {
          console.log('Historique ajouté');
          this.router.navigate(['/histories']);
        },
        error: (err) => {
          console.error('Erreur ajout historique :', err);
          if (err.status === 422 && err.error.errors) {
            console.error('Détails validation :', err.error.errors);
          }
        }
      });
    }
  }
}
