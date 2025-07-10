import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../services/vehicle.service';
import { Vehicle } from '../vehicles/vehicle.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from "../shared/navbar/navbar.component";

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent
]
})
export class VehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private vehicleService: VehicleService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadVehicles();
  }

  loadVehicles() {
    this.loading = true;
    this.errorMessage = '';
    
    this.vehicleService.getVehicles().subscribe({
      next: (data: Vehicle[]) => {
        this.vehicles = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Erreur lors du chargement des véhicules. Veuillez réessayer.';
        this.loading = false;
        console.error('Erreur:', err);
      }
    });
  }

  newVehicle() {
    this.router.navigate(['/vehicles/new']); // Route pour ajouter un véhicule
  }

 editVehicle(vehicle: Vehicle) {
  this.router.navigate(['/vehicles/edit', vehicle.id]);
}


  onDeleteVehicle(id: number) {
    const confirmation = confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?');
    
    if (confirmation) {
      this.loading = true;
      this.vehicleService.deleteVehicle(id).subscribe({
        next: () => {
          this.loadVehicles();
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la suppression du véhicule.';
          this.loading = false;
          console.error('Erreur:', err);
        }
      });
    }
  }
}