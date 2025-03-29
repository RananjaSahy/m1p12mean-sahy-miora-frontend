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
    this.token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
  }
  // Récupérer tous les services
  // getServices(): Observable<any> {
  //   return this.http.get<any>(this.apiUrl);
  // }
// services.service.ts
getServices(page: number = 1, limit: number = 10): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}?page=${page}&limit=${limit}`,{ headers: this.getAuthHeaders() });
}

  // Ajouter un service
  addService(service: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, service,{ headers: this.getAuthHeaders() });
  }

  // Ajouter une entrée dans l'historique d'un service
  addHistorique(serviceId: string, historiqueData: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/${serviceId}/historique`,
      historiqueData, // Envoyez directement l'objet historique sans l'emballer
      { headers: this.getAuthHeaders() }
    );
  }
  updateService(service: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${service._id}`, service,{ headers: this.getAuthHeaders() });
  }
  getServicesParTypeVehicule(typeVehiculeIds: string[]): Observable<any[]> {
    console.log("ato services")
    return this.http.post<any[]>(`${this.apiUrl}/services/filtre-par-types`, { typeVehiculeIds }, { headers: this.getAuthHeaders() });
  }
  getServiceById(serviceId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${serviceId}`);
}
  // Désactiver un service
  desactiverService(serviceId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${serviceId}/desactiver`, {}, { headers: this.getAuthHeaders() });

  }
  activerService(serviceId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${serviceId}/activer`, {}, { headers: this.getAuthHeaders() });

  }

  // Désactiver un historique spécifique
  desactiverHistorique(serviceId: string, historiqueId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${serviceId}/historique/${historiqueId}/desactiver`,{},{ headers: this.getAuthHeaders() });
  }
  toggleHistoriqueEtat(serviceId: string, historiqueId: string, etat: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${serviceId}/historique/${historiqueId}/toggle`,
      { etat },
      { headers: this.getAuthHeaders() }
    );
  }


  searchServices(filters: any): Observable<any> {
    const params: any = {};

    if (filters.service) params.service = filters.service;
    if (filters.typevehicule) params.typevehicule = filters.typevehicule;
    if (filters.prixMin) params.prixMin = filters.prixMin;
    if (filters.prixMax) params.prixMax = filters.prixMax;

    return this.http.get<any>(`${this.apiUrl}/search`, {
      headers: this.getAuthHeaders(),
      params
    });
  }
}
