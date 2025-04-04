import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UtilisateursService {
  private apiUrl = `${environment.apiUrl}/utilisateurs`;

  constructor(private http: HttpClient, private authservice : AuthService) {}
  getMe():Observable<any>{
    const token = this.authservice.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/me`,{headers});
  }

  getMecaniciens(page: number = 1, limit: number = 10, search: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search.trim()) {
      params = params.set('search', search);
    }

    const token = this.authservice.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(`${this.apiUrl}/mecaniciens`, { headers , params });
  }

  getMesvehicules(page: number = 1, limit?:number, search:string = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString());

    if (limit) {
      params = params.set('limit', limit.toString());
    }
    if (search.trim()) {
      params = params.set('search', search);
    }
    const token = this.authservice.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`${this.apiUrl}/mesvehicules`, { params, headers });
  }


  getMesactions(): Observable<any> {
    const token = this.authservice.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`${this.apiUrl}/mesactions`, { headers });
  }
  getFicheClient(idpers:string):Observable<any>{
    const token = this.authservice.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(`${this.apiUrl}/utilisateurs/${idpers}`, { headers });
  }
  getClients(): Observable<any> {
    const token = this.authservice.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`${this.apiUrl}/utilisateurs`, { headers });
  }

}
