import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class  RendezvousService{
   private apiUrl = `${environment.apiUrl}/rendezvous`;
   private tempUrl = `${environment.apiUrl}/utilisateurs`;
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

    getVehicules(): Observable<any> {
     ;
      return this.http.get<any>( `${this.tempUrl}/mesvehicules`,{ headers: this.getAuthHeaders() });
    }
    getServicesDispo(): Observable<any> {
      ;
       return this.http.get<any>( `${this.tempUrl}/messervicesdispo`,{ headers: this.getAuthHeaders() });
     }
     getServicesParVehicule(vehiculeId: string): Observable<any> {
      return this.http.get<any>(`${this.tempUrl}/services/${vehiculeId}`,{ headers: this.getAuthHeaders() });
    }
    ajouterRendezvous(rendezvousData: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/ajouter`, rendezvousData,{ headers: this.getAuthHeaders() });
    }
    confirmerRendezvous(rendezvousData: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/confirmer`, rendezvousData,{ headers: this.getAuthHeaders() });
    }
    getRendezvousUtilisateur() {

      return this.http.get<any[]>(`${this.apiUrl}/mes-rendezvous`,{ headers: this.getAuthHeaders() });
    }
}
