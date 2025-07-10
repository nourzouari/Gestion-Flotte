import { CommonModule } from '@angular/common';
import { Driver } from '../drivers/driver.model';
import { Component, OnInit } from '@angular/core';
import { DriverService } from '../services/driver.service';
import { RouterModule } from '@angular/router'; // 👈 à importer
import { Router } from '@angular/router';
import {  FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from "../shared/navbar/navbar.component";


@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule // ✅ NE PAS mettre d’appel de fonction ici
    ,
    NavbarComponent
],
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit {
drivers: any[] = []; // Temporairement en 'any' pour debug
loading = false;
errorMessage = '';
constructor(private driverService: DriverService, private router: Router) {}

  editDriver(id: number) {
  this.router.navigate(['/drivers/edit', id]);
}

// méthode pour supprimer un conducteur
deleteDriver(id: number) {
  if (confirm('Voulez-vous vraiment supprimer ce conducteur ?')) {
    this.driverService.deleteDriver(id).subscribe({
      next: () => this.loadDrivers(),
      error: () => alert('Erreur lors de la suppression')
    });
  }
}

  ngOnInit() {
    this.loadDrivers();
  }

  loadDrivers() {
    this.driverService.getDrivers().subscribe({
      next: (data) => {
        console.log('Données reçues:', data); // Vérifiez cette ligne
        this.drivers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.loading = false;
      }
    });
  }

  newDriver() {
    this.router.navigate(['/drivers/new']);
  }

  
}