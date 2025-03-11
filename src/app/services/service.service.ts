import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = 'http://localhost:5000/services';

  constructor(private http: HttpClient) {}

  // Récupérer tous les services
  getServices(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Ajouter un service
  addService(service: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, service);
  }

  // Ajouter une entrée dans l'historique d'un service
  addHistorique(serviceId: string, historique: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${serviceId}/historique`, historique);
  }
}
