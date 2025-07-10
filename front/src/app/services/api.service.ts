import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl; // 'http://localhost:8000/api'

  constructor(private http: HttpClient) { }

  // Méthode générique pour les requêtes GET
  get<T>(endpoint: string) {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`);
  }

  // Méthode générique pour les requêtes POST
  post<T>(endpoint: string, data: any) {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data);
  }

  // Méthode générique pour les requêtes PUT
  put<T>(endpoint: string, data: any) {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data);
  }

  // Méthode générique pour les requêtes DELETE
  delete<T>(endpoint: string) {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`);
  }
}