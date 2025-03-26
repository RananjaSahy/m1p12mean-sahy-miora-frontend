import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypevehiculesService {
  private apiUrl = `${environment.apiUrl}/typevehicules`;

  constructor(private http: HttpClient, private authservice : AuthService) {}

  getTypevehicules(page: number = 1, limit?: number, search: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString());

    if (limit) {
      params = params.set('limit', limit.toString());
    }
    if (search.trim()) {
      params = params.set('search', search);
    }

    return this.http.get<any>(`${this.apiUrl}`, { params });
  }

  ajouterType(newType:any) : Observable<any> {
    const token = this.authservice.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}`,newType, {headers});
  }
}
