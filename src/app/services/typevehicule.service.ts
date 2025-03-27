import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class TypevehiculeService {
  private apiUrl = `${environment.apiUrl}/typevehicules`;
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
  // Récupérer tous les typevehicules
  getTypevehicule(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

}
