import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehiculesService {
  private apiUrl = `${environment.apiUrl}/vehicules`;
  constructor(private http: HttpClient, private authservice : AuthService) { }

  postVehicule(newvehicule: any): Observable<any> {
    const token = this.authservice.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    return this.http.post(`${this.apiUrl}`,newvehicule,{headers});
  }
}
