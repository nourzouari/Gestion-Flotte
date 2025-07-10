import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentTitle = '';
  driverInitial = '';

  constructor(private router: Router, private authService: AuthService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateTitle();
      });
  }

dropdownOpen = false;
currentUser: any;
//driverInitial = '';

ngOnInit() {
  const user = this.authService.getCurrentUser?.();
  if (user) {
    this.currentUser = user;
    this.driverInitial = user.name?.charAt(0).toUpperCase();
  }
}

toggleDropdown() {
  this.dropdownOpen = !this.dropdownOpen;
}


private updateTitle() {
  const url = this.router.url.toLowerCase();

  if (url.startsWith('/vehicles') || url.startsWith('/assign-vehicle') || url.startsWith('/vehicle-availability')) {
    this.currentTitle = 'Gestion des Véhicules';
  } else if (url.startsWith('/drivers')) {
    this.currentTitle = 'Gestion des Conducteurs';
  } else if (url.startsWith('/histories')) {
    this.currentTitle = 'Gestion des Historiques';
  } else {
    this.currentTitle = 'Tableau de bord';
  }
}

logout(): void {
  this.authService.logout();
  this.router.navigate(['/login']);
}


}