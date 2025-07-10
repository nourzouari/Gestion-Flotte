import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../vehicle.model';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.scss']
})
export class VehicleFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  vehicleId?: number;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService
  ) {
    this.form = this.fb.group({
  registration_number: ['', Validators.required],
  brand: ['', Validators.required],
  model: ['', Validators.required],
  year: ['', [Validators.required, Validators.min(1900)]],
  type: ['', Validators.required]  // ✅ CHAMP MANQUANT
});
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.vehicleId = +id;
        this.loadVehicleData(this.vehicleId);
      }
    });
  }

  loadVehicleData(id: number) {
  console.log('ID du véhicule:', id); // Vérifiez que l'ID est correct
  this.loading = true;
  this.vehicleService.getVehicleById(id).subscribe({
    next: (vehicle) => {
      console.log('Données reçues du service:', vehicle); // Vérifiez les données
      console.log('Structure du formulaire avant patch:', this.form.value);
      
      this.form.patchValue({
      registration_number: vehicle.registration_number,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      type: vehicle.type // ✅ Ajout ici aussi
});

      
      console.log('Structure du formulaire après patch:', this.form.value);
      this.loading = false;
    },
    error: (err) => {
      console.error('Erreur complète:', err);
      this.loading = false;
    }
  });
}
onSubmit() {
  if (this.form.invalid) return;

  this.loading = true;
  const operation = this.isEditMode && this.vehicleId
    ? this.vehicleService.updateVehicle(this.vehicleId, this.form.value)
    : this.vehicleService.createVehicle(this.form.value);

  operation.subscribe({
    next: (response) => {
      this.loading = false;
      // Force la navigation même si déjà sur la route
      this.router.navigate(['/vehicles'], {
        onSameUrlNavigation: 'reload' // Nouveauté importante
      });
    },
    error: (err) => {
      console.error('Erreur:', err);
      this.loading = false;
    }
  });
}

  navigateToVehicleList() {
    this.router.navigate(['/vehicles']);
  }
}