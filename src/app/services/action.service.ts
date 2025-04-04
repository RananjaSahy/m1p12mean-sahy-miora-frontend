import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
 private apiUrl = `${environment.apiUrl}/action`;
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
  getActions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getActionsByRendezvous(rendezvousId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rendezvous/${rendezvousId}`);
  }
  updateAction(actionId: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${actionId}`, data,{ headers: this.getAuthHeaders() });
  }

  setActionEncours(actionId: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/${actionId}/encours`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }


  terminerAction(actionId: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/${actionId}/terminer`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }


  annulerAction(actionId: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/${actionId}/annuler`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  replannifierAction(actionId: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/${actionId}/replannifier`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }
}
