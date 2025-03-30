import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorModalComponent } from '../error/error.component';
import { RendezvousMService } from '../../services/rendezvousmanager.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceService } from '../../services/service.service';
import { TypevehiculeService } from '../../services/typevehicule.service';
@Component({
  selector: 'app-rendezvous-manager',
   imports: [
      CommonModule,
      FormsModule
    ],
  templateUrl: './rendezvous-manager.component.html',
  styleUrls: ['./rendezvous-manager.component.css']
})
export class RendezvousManagerComponent implements OnInit {
  @ViewChild(ErrorModalComponent) errorModal!: ErrorModalComponent;

  rendezvousList: any[] = [];  // Stocke les rendez-vous récupérés
  type_vehicules: any[] = [];  // Liste des types de véhicules
  servicesList: any[] = [];    // Liste des services disponibles

  filters = {
    dateMin: '',
    dateMax: '',
    heureMin:'',
    heureMax:'',
    typevehicule: '',
    services: '',
    nomUtilisateur: ''
  };
  constructor(private rendezvousmService: RendezvousMService,
          private serviceService : ServiceService,
          private typevehiculeService: TypevehiculeService
  ) {}

  ngOnInit(): void {
    this.loadRendezvous();
    this.loadTypeVehicules();
    this.loadServices();
   }
   loadTypeVehicules(): void {
    this.typevehiculeService.getTypevehicule().subscribe((data: any) => {
      if (data && data.typevehicules) {
        this.type_vehicules = data.typevehicules;
        console.log("data type = ",data.typevehicules);
      } else {
        console.error("Erreur : données inattendues", data);
        this.type_vehicules = []; // Évite une erreur d'affichage
      }
    });
  }

  // Charger la liste des services (appel API si nécessaire)
  loadServices(): void {
    this.serviceService.getServices().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.servicesList = data;
        } else if (data?.data && Array.isArray(data.data)) {
          this.servicesList = data.data;
        } else {
          console.error("Format inattendu des services :", data);
          this.servicesList = [];
        }

        console.log("Données des services :", this.servicesList);
      },
      error: (error: any) => {
        console.error("Erreur lors de la récupération des services", error);
        this.servicesList = [];
      }
    });
  }

  loadRendezvous(filters: any = {}): void {
    this.rendezvousmService.getRendezvous(filters).subscribe({
      next: (data: any) => {
        console.log("Réponse de l'API:", data); // Vérifie si "data" contient "data"
        this.rendezvousList = Array.isArray(data) ? data : data.data;
      },
      error: (error: any) => {
        console.error("Erreur lors de la récupération des rendez-vous", error);
      }
    });
  }
  applyFilters(): void {
    const filtersToSend: any = {};

    if (this.filters.dateMin) filtersToSend.dateMin = this.filters.dateMin;
    if (this.filters.dateMax) filtersToSend.dateMax = this.filters.dateMax;

    if (this.filters.heureMin) filtersToSend.heureMin = this.filters.heureMin;
    if (this.filters.heureMax) filtersToSend.heureMax = this.filters.heureMax;

    if (this.filters.typevehicule) filtersToSend.typevehicule = this.filters.typevehicule;
    if (this.filters.nomUtilisateur) filtersToSend.nomUtilisateur = this.filters.nomUtilisateur;

    if (this.filters.services) {
        filtersToSend.service = this.filters.services;  // Un seul service
    }

    filtersToSend.page = this.currentPage;
    filtersToSend.limit = this.itemsPerPage;

    this.loadRendezvous(filtersToSend);
}
totalPages: number = 1;
currentPage: number = 1;
itemsPerPage: number = 10; // Nombre d'éléments par page

changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.applyFilters(); // Rafraîchir les résultats
    }
}

}
