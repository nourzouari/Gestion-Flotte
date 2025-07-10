
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Modules Angular Material requis
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DriverService } from './services/driver.service';

// Modules Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    // Modules Material
    MatButtonModule,
    MatCardModule,
    MatToolbarModule
  ],
  template: `
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
  `]
})
export class AppComponent {
  title = 'flotte-manager';

  constructor(private driverService: DriverService) {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.driverService.getDrivers().subscribe({
      next: (drivers) => console.log('Drivers loaded', drivers),
      error: (err) => console.error('Error loading drivers', err)
    });
  }
}