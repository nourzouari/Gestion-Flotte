import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Vehicle } from '../vehicles/vehicle.model';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = `${environment.apiUrl}/vehicles`;

  constructor(private http: HttpClient) {}

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<{ success: boolean; data: Vehicle[] }>(this.apiUrl).pipe(
      map(response => response.data || [])
    );
  }

  getVehicle(id: number): Observable<Vehicle> {
    return this.http.get<{ success: boolean; data: Vehicle }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  createVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<{ success: boolean; data: Vehicle }>(this.apiUrl, vehicle).pipe(
      map(response => response.data)
    );
  }

 updateVehicle(id: number, vehicle: Vehicle): Observable<Vehicle> {
  return this.http.put<{ success: boolean; data: Vehicle }>(`${this.apiUrl}/${id}`, vehicle).pipe(
    map(response => response.data)
  );
}

  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

getVehicleById(id: number): Observable<Vehicle> {
    return this.http.get<{ success: boolean; data: Vehicle }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }
getAvailableVehicles(): Observable<Vehicle[]> {
  return this.http.get<Vehicle[]>(`${environment.apiUrl}/vehicles-available`);
}
  /* getAvailableVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/available`);
  }*/


getAvailableVehiclesBetweenDates(startDate: string, endDate: string): Observable<Vehicle[]> {
  const params = new HttpParams()
    .set('start_date', startDate)
    .set('end_date', endDate);

  const url = `${this.apiUrl}-available`; // ex: http://localhost:8000/api/v1/vehicles-available

  return this.http.get<Vehicle[]>(url, { params }).pipe( // ← Modification ici
    catchError(error => {
      console.error('Erreur API:', error);
      return throwError(() => error);
    })
  );
}


}
