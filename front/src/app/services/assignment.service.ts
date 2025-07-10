import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Assignment } from '../vehicle-assignment/assignment.model';
import { Observable } from 'rxjs';
import { Vehicle } from '../vehicles/vehicle.model';
import { Driver } from '../drivers/driver.model';
import { map } from 'rxjs/operators'; // à importer si ce n'est pas déjà fait

@Injectable({ providedIn: 'root' })
export class AssignmentService {
  private apiUrl = 'api/assignments'; // URL de l'API backend

  constructor(private http: HttpClient) {}

  createAssignment(data: {
    driverId: number;
    vehicleId: number;
    startDate: string;
    endDate: string;
    notes?: string;
  }): Observable<Assignment> {
    return this.http.post<Assignment>(this.apiUrl, {
      driver_id: data.driverId,
      vehicle_id: data.vehicleId,
      start_date: data.startDate,
      end_date: data.endDate,
      notes: data.notes,
    });
  }

  getAssignments(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(this.apiUrl);
  }

  deleteAssignment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  assignVehicle(driverId: number, vehicleId: number) {
    return this.http.post(`${this.apiUrl}`, { driverId, vehicleId });
  }

  getDriverAssignments(driverId: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/driver/${driverId}`);
  }

  checkAvailability(
    vehicleId: number,
    startDate: string,
    endDate: string
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/check-availability`, {
      vehicle_id: vehicleId,
      start_date: startDate,
      end_date: endDate,
    });
  }

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>('api/vehicles');
  }

  getDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>('api/drivers');
  }

updateAssignment(id: number, data: Partial<Assignment>): Observable<Assignment> {
  return this.http.put<Assignment>(`${this.apiUrl}/${id}`, data);
}

 
getAssignmentById(id: number): Observable<any> {
  return this.http.get(`/api/assignments/${id}`);
}

}
