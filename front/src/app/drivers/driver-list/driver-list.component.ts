import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Driver } from '../driver.model';
import { DriverService } from '../../services/driver.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-driver-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.scss']
})
export class DriverListComponent  implements OnInit {
  driverForm!: FormGroup;
  isEditMode = false;
  driverId!: number;

  constructor(
    private fb: FormBuilder,
    private driverService: DriverService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.driverForm = this.fb.group({
      name: ['', Validators.required],
      license_number: ['', Validators.required],
      phone: [''],
      email: ['']
    });

    this.driverId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.driverId) {
      this.isEditMode = true;
      this.driverService.getDriverById(this.driverId).subscribe({
        next: (driver) => {
          if (driver) this.driverForm.patchValue(driver);
        },
        error: (err) => {
          console.error('Erreur chargement conducteur:', err);
          // Eventuellement rediriger si id invalide
        }
      });
    }
  }

  onSubmit(): void {
    if (this.driverForm.invalid) return;

    const driverData = this.driverForm.value;

    if (this.isEditMode) {
      this.driverService.updateDriver(this.driverId, driverData).subscribe(() => {
        this.router.navigate(['/drivers']);
      });
    } else {
      this.driverService.createDriver(driverData).subscribe(() => {
        this.router.navigate(['/drivers']);
      });
    }
  }

  
}