import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = `${environment.apiUrl}/services`;
  private token: string | null = null;
  constructor(private http: HttpClient, private authService: AuthService) {
    this.token = this.authService.getToken();
  }
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
  }
  // Récupérer tous les services
  getServices(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Ajouter un service
  addService(service: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, service,{ headers: this.getAuthHeaders() });
  }

  // Ajouter une entrée dans l'historique d'un service
  addHistorique(serviceId: string, historique: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${serviceId}/historique`, historique,{ headers: this.getAuthHeaders() });
  }
  updateService(service: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${service._id}`, service,{ headers: this.getAuthHeaders() });
  }

}
