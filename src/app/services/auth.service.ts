import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private apiUrlStaff = `${environment.apiUrl}/authstaff`
  constructor(private http: HttpClient) {}
  
  storeToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.role || null;
    } catch (error) {
      return null;
    }
  }


  logout(): void {
    localStorage.removeItem('token');
  }
  registerclient(register:any) : Observable<any> {
    return this.http.post(`${this.apiUrl}/register`,register);
  }

  loginclient(login:any) : Observable<any> {
    return this.http.post(`${this.apiUrl}/login`,login);
  }

  loginstaff(login:any) : Observable<any> {
    return this.http.post(`${this.apiUrlStaff}/login`,login);
  }

  registermecanicien(register:any) : Observable<any> {
    const token = this.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    return this.http.post(`${this.apiUrlStaff}/register-mecanicien`,register,{headers});
  }
}
