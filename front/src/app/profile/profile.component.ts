import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router'; // Ajoute ce import

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule // Ajouté ici
    ,
    NavbarComponent
],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  error: boolean = false;
  loading: boolean = true;

constructor(
  private authService: AuthService,
  private router: Router // Injecte le router
) {}  color: string = '';

ngOnInit() {
  this.color = this.getRandomColor();
  this.loadUserData();
}
  async loadUserData() {
    this.loading = true;
    this.error = false;
    
    try {
      this.user = await this.authService.getCurrentUser();
      
      // Valeurs par défaut
      if (this.user) {
        this.user.created_at = this.user.created_at || new Date().toISOString();
      } else {
        this.error = true;
      }
    } catch (err) {
      this.error = true;
      console.error('Failed to load user data', err);
    } finally {
      this.loading = false;
    }
  }

  getRandomColor(): string {
    const colors = ['#1976d2', '#d32f2f', '#388e3c', '#7b1fa2', '#ffa000'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  navigateToEditProfile(): void {
  this.router.navigate(['/profile/edit']);
}

navigateToChangePassword(): void {
  this.router.navigate(['/profile/change-password']);
}

  // Méthodes vides qui pourraient être implémentées plus tard
  openEditDialog(): void {
    console.log('Édition du profil - À implémenter');
    // Ici vous pourriez rediriger vers une page d'édition si vous préférez
    // this.router.navigate(['/profile/edit']);
  }

  changePassword(): void {
    console.log('Changement de mot de passe - À implémenter');
    // this.router.navigate(['/change-password']);
  }
}