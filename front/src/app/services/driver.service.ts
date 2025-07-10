import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Driver } from '../drivers/driver.model'; // Assurez-vous que le chemin est correct
import { Vehicle } from '../vehicles/vehicle.model';
@Injectable({
  providedIn: 'root'
})

export class DriverService {
  private apiUrl = `${environment.apiUrl}/drivers`;

  constructor(private http: HttpClient) {}

  // 🔍 Récupérer tous les conducteurs
  getDrivers(): Observable<Driver[]> {
    return this.http.get<{ success: boolean; data: Driver[] }>(this.apiUrl).pipe(
      map(response => {
        console.log('Réponse API (getDrivers) :', response);
        return response.data || [];
      })
    );
  }

  // 🔍 Récupérer un conducteur par ID
  getDriverById(id: number): Observable<Driver> {
    return this.http.get<{ success: boolean; data: Driver }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  // ➕ Ajouter un conducteur
  createDriver(driver: Omit<Driver, 'id'>): Observable<Driver> {
    return this.http.post<{ success: boolean; data: Driver }>(this.apiUrl, driver).pipe(
      map(response => response.data)
    );
  }

  // ✏️ Mettre à jour un conducteur
  updateDriver(id: number, driver: Driver): Observable<Driver> {
    // Ne pas envoyer le password s'il est vide (en mode édition)
    const dataToSend = {...driver};
    if (!dataToSend.password) {
      delete dataToSend.password;
    }
    return this.http.put<{ success: boolean; data: Driver }>(`${this.apiUrl}/${id}`, dataToSend).pipe(
      map(response => response.data)
    );
  }


  // ❌ Supprimer un conducteur
  deleteDriver(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

assignVehicle(driverId: number, vehicleId: number, assignmentDate: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${driverId}/vehicles`,
      { vehicle_id: vehicleId, assignment_date: assignmentDate }
    );
  }

  getDriverVehicles(driverId: number): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/${driverId}/vehicles`);
  }



}


