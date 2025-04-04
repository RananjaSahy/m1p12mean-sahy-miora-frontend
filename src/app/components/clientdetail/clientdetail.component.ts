import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UtilisateursService } from '../../services/utilisateurs.service';

@Component({
  selector: 'app-clientdetail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './clientdetail.component.html',
  styleUrls: ['./clientdetail.component.css']
})
export class ClientDetailComponent implements OnInit {
  utilisateur: any = {};
  mesvehicules: any[] = [];
  totalVehicule: number = 0;
  clientId: string | null = null;
  totalrdv: number = 0;
  clients: any[] = [];  // Liste des clients si aucun id
  isClientDetail: boolean = false;  // Flag pour savoir si c'est un détail client ou une liste

  constructor(
    private route: ActivatedRoute,
    private utilisateurService: UtilisateursService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Vérifier si un id est passé dans l'URL
    this.clientId = this.route.snapshot.paramMap.get('id');

    if (this.clientId) {
      // Si un ID est passé, afficher les détails de ce client
      this.isClientDetail = true;
      this.utilisateurService.getFicheClient(this.clientId).subscribe(
        (data) => {
          console.log("Détails du client : ", data);
          this.utilisateur = data.utilisateur;
          this.mesvehicules = data.vehicules;
          this.totalVehicule = data.totalVehicule;
          this.totalrdv = data.rendezvous.length;
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Erreur lors du chargement des données du client', error);
        }
      );
    } else {
      // Si aucun ID n'est passé, afficher la liste de tous les clients
      this.isClientDetail = false;
      this.utilisateurService.getClients().subscribe(
        (data) => {
          this.clients = data.utilisateurs;  // Récupérer la liste des clients
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Erreur lors du chargement des clients', error);
        }
      );
    }
  }
}
