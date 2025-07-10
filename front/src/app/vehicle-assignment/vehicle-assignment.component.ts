import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Vehicle } from '../vehicles/vehicle.model';
import { Driver } from '../drivers/driver.model';
import { AssignmentService } from '../services/assignment.service';
import { DriverService } from '../services/driver.service';
import { VehicleService } from '../services/vehicle.service';
import { NavbarComponent } from "../shared/navbar/navbar.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vehicle-assignment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    NavbarComponent
],
  templateUrl: './vehicle-assignment.component.html',
  styleUrls: ['./vehicle-assignment.component.scss']
})
export class VehicleAssignmentComponent implements OnInit {
  assignmentForm: FormGroup;
  drivers: Driver[] = [];
  vehicles: Vehicle[] = [];
  loading = false;
  errorMessage = '';
  minDate: Date = new Date();
  isEditMode = false;
  assignmentId?: number;

  constructor(
    private fb: FormBuilder,
    private driverService: DriverService,
    private vehicleService: VehicleService,
    private assignmentService: AssignmentService,
    private router: Router,
    private route: ActivatedRoute,

  ) {
    this.assignmentForm = this.fb.group({
      driver_id: ['', Validators.required],
      vehicle_id: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      notes: ['']
    });
  }
  ngOnInit(): void {
  // Regarder si on est en mode édition (id dans l'URL)
  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    if (id) {
      this.assignmentId = +id;
      this.isEditMode = true;
      this.loadAssignment(this.assignmentId); // Charge les données existantes
    }
  });

  this.loadData(); // Charge les conducteurs + véhicules
  this.setupDateListeners();
}
loadAssignment(id: number): void {
  this.assignmentService.getAssignmentById(id).subscribe({
    next: (assignment) => {
this.assignmentForm.patchValue({
  driver_id: assignment.driver_id,
  vehicle_id: assignment.vehicle_id,
  // Extrais la partie date au format YYYY-MM-DD
  start_date: assignment.start_date ? assignment.start_date.substring(0, 10) : '',
  end_date: assignment.end_date ? assignment.end_date.substring(0, 10) : '',
  notes: assignment.notes || ''
});


    },
    error: () => {
      this.errorMessage = "Erreur lors du chargement de l'attribution.";
    }
  });
}


   private setupDateListeners(): void {
    this.assignmentForm.get('start_date')!.valueChanges.subscribe(() => this.loadAvailableVehiclesIfDatesValid());
    this.assignmentForm.get('end_date')!.valueChanges.subscribe(() => this.loadAvailableVehiclesIfDatesValid());
  }

  loadData(): void {
    this.loading = true;
    this.driverService.getDrivers().subscribe({
      next: (drivers) => {
        this.drivers = drivers;
        // Charger TOUS les véhicules au départ
        this.vehicleService.getVehicles().subscribe({
          next: (vehicles) => {
            this.vehicles = vehicles;
            this.loading = false;
          },
          error: () => {
            this.errorMessage = 'Erreur chargement véhicules';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.errorMessage = 'Erreur chargement conducteurs';
        this.loading = false;
      }
    });
  }

loadAvailableVehiclesIfDatesValid(): void {
  const startDate = this.assignmentForm.get('start_date')!.value;
  const endDate = this.assignmentForm.get('end_date')!.value;

  if (startDate && endDate) {
    const formattedStart = this.formatDate(new Date(startDate));
    const formattedEnd = this.formatDate(new Date(endDate));

    console.log('🔍 Vérification véhicules disponibles pour :', formattedStart, formattedEnd);

    this.vehicleService.getAvailableVehiclesBetweenDates(formattedStart, formattedEnd).subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        if (vehicles.length === 0) {
          this.errorMessage = 'Aucun véhicule disponible pour cette période.';
        } else {
          this.errorMessage = '';
        }
      },
      error: () => {
        this.errorMessage = 'Erreur chargement véhicules disponibles';
        this.vehicles = [];
      }
    });
  } else {
    // Recharger tous les véhicules
    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Erreur chargement véhicules';
        this.vehicles = [];
      }
    });
  }
}

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }
private formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mois de 1 à 12
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
}
onSubmit(): void {
  if (this.assignmentForm.invalid) {
    this.markFormGroupTouched(this.assignmentForm);
    return;
  }

  this.loading = true;
  this.errorMessage = '';

  const formData = this.assignmentForm.value;
  const payload = {
    driverId: formData.driver_id,
    vehicleId: formData.vehicle_id,
    startDate: this.formatDate(new Date(formData.start_date)),
    endDate: this.formatDate(new Date(formData.end_date)),
    notes: formData.notes
  };

  if (this.isEditMode && this.assignmentId) {
    // 🔄 Mode édition
    this.assignmentService.updateAssignment(this.assignmentId, payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/assignments']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de la mise à jour';
      }
    });
  } else {
    // ➕ Mode création
    this.assignmentService.createAssignment(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/assignments']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de la création';
      }
    });
  }
}



  cancel(): void {
    this.router.navigate(['/assignments']);
  }
}