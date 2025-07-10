import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, catchError, tap, throwError } from 'rxjs';
interface User {
  name: string;
  email: string;
  // ajoute ici les autres propriétés si besoin
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Authentifie l'utilisateur et stocke le token JWT
   */
 login(email: string, password: string, remember: boolean): Observable<any> {
  return this.http.post<any>('http://localhost:8000/api/v1/login', { email, password }).pipe(
    tap(response => {
      console.log('✅ Réponse API login:', response);

      const user = response?.driver || response?.user || response;

      if (user && user.name) {
        // Si "se souvenir de moi" est coché, on utilise localStorage
        // Sinon, on utilise sessionStorage (sera vidé après fermeture du navigateur)
        const storage = remember ? localStorage : sessionStorage;

        storage.setItem('currentUser', JSON.stringify(user));
        console.log('✅ Utilisateur stocké dans', remember ? 'localStorage' : 'sessionStorage', user);
      } else {
        console.warn('⚠️ Aucun utilisateur valide dans la réponse !');
      }
    })
  );
}

  /**
   * Déconnecte l'utilisateur et nettoie le stockage local
   */
 logout(): void {
    localStorage.removeItem('currentUser');
  }
getCurrentUser() {
  const userJson = sessionStorage.getItem('currentUser'); // ou le nom que tu as utilisé
  if (userJson) {
    return JSON.parse(userJson);
  }
  return null;
}

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * Vérifie si le token JWT est expiré
   */
  isTokenExpired(token: string): boolean {  // Retirer 'private'
  try {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return true;
    
    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(payload.exp);
    return expirationDate.valueOf() < new Date().valueOf();
  } catch (err) {
    return true;
  }
}

  /**
   * Décode le token JWT sans vérification de signature
   */
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  }

  /**
   * Récupère le token depuis le stockage local
   */
 getToken(): string | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('authToken');
  }
  return null;
}


  /**
   * Récupère les données utilisateur depuis le stockage local
   */
  getUserData(): any {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  // Méthodes privées
  private setAuthData(token: string, userData: any): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Stocke également la date d'expiration pour un accès facile
    const payload = this.decodeToken(token);
    if (payload?.exp) {
      localStorage.setItem('tokenExpiration', payload.exp.toString());
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('tokenExpiration');
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  private handleError(error: any): string {
    console.error('Erreur d\'authentification:', error);
    
    if (error.status === 401) {
      return 'Identifiants incorrects';
    } else if (error.status === 403) {
      return 'Accès refusé';
    } else if (error.status === 0) {
      return 'Connexion au serveur impossible';
    }
    return error.error?.message || 'Une erreur est survenue';
  }
}