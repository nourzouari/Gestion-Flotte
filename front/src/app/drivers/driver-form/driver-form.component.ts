import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DriverService } from '../../services/driver.service'; // ✅ Adapter chemin si besoin
import { Driver } from '../../drivers/driver.model'; // ✅ Adapter chemin si besoin

@Component({
  standalone: true,
  selector: 'app-driver-form',
  templateUrl: './driver-form.component.html',
  styleUrls: ['./driver-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class DriverFormComponent implements OnInit {
  driverForm!: FormGroup;
  isEditMode = false;
  driverId!: number;
  loading = false;

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
      email: [''],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(8)]] // Requis seulement en création


    });

    // Mode édition si URL contient un id
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.driverId = +id;
      this.driverService.getDriverById(this.driverId).subscribe(driver => {
        this.driverForm.patchValue(driver);
        this.driverForm.get('password')?.clearValidators();
        this.driverForm.get('password')?.updateValueAndValidity();
      });
    }
  }

  onSubmit(): void {
    if (this.driverForm.invalid) return;

    const formData = this.driverForm.value;

    if (this.isEditMode && this.driverId) {
      this.driverService.updateDriver(this.driverId, formData).subscribe(() => {
        this.router.navigate(['/drivers']);
      });
    } else {
      this.driverService.createDriver(formData).subscribe(() => {
        this.router.navigate(['/drivers']);
      });
    }
  }
 navigateDriversList() {
    this.router.navigate(['/drivers']);
  }
}