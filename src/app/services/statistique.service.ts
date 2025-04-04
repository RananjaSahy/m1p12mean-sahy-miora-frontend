import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StatistiqueService {
  private apiUrl = `${environment.apiUrl}`;
  private token: string | null = null;

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
  }

  constructor(private http: HttpClient, private authService: AuthService) {
    this.token = this.authService.getToken();
  }
  // Récupérer le taux d'occupation des mécaniciens
  getTauxOccupation(filters: { dateMin: string, dateMax: string }): Observable<any> {
    const params = {
      dateMin: filters.dateMin || '',
      dateMax: filters.dateMax || ''
    };
    return this.http.get(`${this.apiUrl}/action/taux-occupation`,{params});
  }
}
