import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RendezvousMService {
  private apiUrl = `${environment.apiUrl}/rendezvousm`;
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
  getRendezvous(params?: any): Observable<any> {
    return this.http.get<any>(this.apiUrl, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }
  getInvoice(idRendezvous: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/action/facture/${idRendezvous}`);
  }
}
