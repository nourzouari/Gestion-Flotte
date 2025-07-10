import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true, // Ajout du flag standalone
  imports: [
    CommonModule,
    ReactiveFormsModule, // Nécessaire pour [formGroup]
    RouterModule // Si vous utilisez routerLink dans le template
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
 loginForm: FormGroup;
  loading = false;
  showPassword = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Changé de username à email
      password: ['', [Validators.required, Validators.minLength(8)]],
      remember: [false]
    });
  }

  onSubmit(): void {
  if (this.loginForm.invalid) return;

  this.loading = true;
  this.errorMessage = null;

  const { email, password, remember } = this.loginForm.value; // 👈 récupère aussi 'remember'

  this.authService.login(email, password, remember).subscribe({
    next: () => {
      this.router.navigate(['/vehicles']);  // Redirection après succès
    },
    error: (error) => {
      this.errorMessage = 'Email ou mot de passe invalide';
      this.loading = false;
    }
  });
}

getCurrentUser(): { name: string } | null {
  const userJson = localStorage.getItem('currentUser');
  if (userJson) {
    return JSON.parse(userJson);
  }
  return null;
}
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
 


}