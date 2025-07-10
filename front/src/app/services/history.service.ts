import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { History } from '../histories/history.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private apiUrl = `${environment.apiUrl}/histories`;

  constructor(private http: HttpClient) {}

  /**
   * Récupérer tous les historiques
   */
  getHistories(): Observable<History[]> {
    return this.http.get<{ success: boolean, data: History[] }>(this.apiUrl).pipe(
      map(response => response.data || [])
    );
  }
  getHistoryById(id: number): Observable<History> {
  return this.http.get<{ success: boolean, data: History }>(`${this.apiUrl}/${id}`).pipe(
    map(response => response.data)
  );
}

  /**
   * Récupérer les historiques d’un conducteur
   */
  getHistoriesByDriver(driverId: number): Observable<History[]> {
    return this.http.get<{ success: boolean, data: History[] }>(`${this.apiUrl}/driver/${driverId}`).pipe(
      map(response => response.data || [])
    );
  }

  /**
   * Créer un historique
   */

createHistory(history: Omit<History, 'id'>): Observable<History> {
  return this.http.post<{ success: boolean, data: History }>(this.apiUrl, history).pipe(
    map(response => response.data)
  );
}



  /**
   * Supprimer un historique
   */
  deleteHistory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Modifier un historique
   */
  updateHistory(id: number, history: History): Observable<History> {
    return this.http.put<History>(`${this.apiUrl}/${id}`, history);
  }
}
