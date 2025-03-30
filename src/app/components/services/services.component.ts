import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../../services/service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ErrorModalComponent } from '../error/error.component';
import { TypevehiculeService } from '../../services/typevehicule.service';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-services',
  imports: [CommonModule, FormsModule], // Ajoute FormsModule ici
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  @ViewChild(ErrorModalComponent) errorModal!: ErrorModalComponent;
  isManager: boolean = false;
  showSuccessAlert: boolean = false;
  userRole: string | null = '';
  services: any[] = [];
  type_vehicules: any[] = [];
  selectedService: any = {
    nom: '',
    description: '',
    historique: []
  };

  newService: any = {
    nom: '',
    description: '',
    historique: [{ date: '', prix: '', duree: '', typevehicule: '' }]
  };
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 3; // Modifiable

  constructor(private serviceService: ServiceService,
     private authService: AuthService, private typevehiculeService: TypevehiculeService
    , private errorService: ErrorService,
    private cdr: ChangeDetectorRef
  ) {
    this.userRole = this.authService.getUserRole();
    this.isManager = this.userRole === 'manager';
  }

  ngOnInit(): void {
    this.loadServices();
    this.typevehiculeService.getTypevehicule().subscribe((data: any) => {// Vérifie la structure dans la console

      if (data && data.typevehicules) {
        this.type_vehicules = data.typevehicules;
      } else {
        console.error("Erreur : données inattendues", data);
        this.type_vehicules = []; // Évite une erreur d'affichage
      }
    });

    console.log(this.type_vehicules);
    this.searchServices();
  }
  // partie affichages services
  formatTypeVehicules(typevehicules: any[]): string {
    if (!typevehicules || typevehicules.length === 0) {
      return ''; // Aucun type de véhicule
    }

    if (typevehicules.length <= 2) {
      return typevehicules.map((t: any) => t.libelle).join(', '); // Si moins de 3 types, on les affiche tous
    }

    // Sinon, on affiche les 3 premiers et le reste sous forme de "X autres"
    const firstThree = typevehicules.slice(0, 2).map((t: any) => t.libelle).join(', ');
    const othersCount = typevehicules.length - 2;
    return `${firstThree} et ${othersCount} autres`;
  }

  loadServices(): void {
    this.serviceService.getServices(this.currentPage, this.itemsPerPage).subscribe((response: any) => {
      this.services = response.data.map((service: any) => ({
        ...service,
        historique: service.historique.map((h: any) => ({
          ...h,
          typevehicule: h.typevehicule ? h.typevehicule.libelle : 'Non défini'
        })),
        typevehicules: this.formatTypeVehicules(service.historique
          .filter((h: any) => h.typevehicule) // Filtrer seulement ceux qui ont un typevehicule
          .map((h: any) => h.typevehicule)  // Extraire le typevehicule
        )
      }));

      this.totalPages = response.totalPages;
    });
    console.log(this.services);
  }
  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.loadServices();
    }
  }

  changeItemsPerPage(event: any): void {
    this.itemsPerPage = +event.target.value;
    this.currentPage = 1; // Revenir à la première page après changement
    this.loadServices();
  }

  // partie affichage formattée début
  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR').format(prix);
  }

  onDureeChange(event: Event, index: number) {
    const inputElement = event.target as HTMLElement;

    // ✅ Sauvegarder la position du curseur
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    const cursorPosition = range ? range.startOffset : null;

    const newValue = inputElement.innerText.trim(); // Récupérer la nouvelle valeur

    // ✅ Convertir en minutes avant de stocker
    const convertedMinutes = this.parseDuree(newValue);
    if (isNaN(convertedMinutes)) {
      console.error("Format invalide :", newValue);
      return;
    }

    this.selectedService.historique[index].duree = convertedMinutes;

    setTimeout(() => {
      if (cursorPosition !== null) {
        const range = document.createRange();
        const selection = window.getSelection();
        range.setStart(inputElement.childNodes[0] || inputElement, cursorPosition);
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }, 0);
  }

  parseDuree(dureeStr: string): number {
    let totalMinutes = 0;

    // Vérifier si la durée contient des heures
    const heureMatch = dureeStr.match(/(\d+)h/);
    if (heureMatch) {
      totalMinutes += parseInt(heureMatch[1], 10) * 60;
    }

    // Vérifier si la durée contient des minutes
    const minuteMatch = dureeStr.match(/(\d+)min/);
    if (minuteMatch) {
      totalMinutes += parseInt(minuteMatch[1], 10);
    }

    return totalMinutes;
  }
  formatDuree(duree: number): string {
    if (duree >= 60) {
      const heures = Math.floor(duree / 60);
      const minutes = duree % 60;
      return minutes > 0 ? `${heures}h ${minutes}min` : `${heures}h`;
    }
    return `${duree} min`;
  }
  savePriceChange(index: number) {
    if (!this.selectedService || !this.selectedService._id) {
      console.error("Service non défini !");
      return;
    }

    const historique = this.selectedService.historique[index];

    // S'assurer que duree est bien une string avant de la parser
    const dureeStr = historique.duree;
    const convertedDuration = dureeStr;
    // Récupérer l'ID du type de véhicule
    const typevehiculeId = this.getTypeVehiculeId(historique.typevehicule);

    if (!typevehiculeId) {
      console.error("ID du type de véhicule introuvable pour :", historique.typevehicule);
      return;
    }

    this.serviceService.addHistorique(this.selectedService._id, {
      date: new Date().toISOString(),
      prix: historique.prix,
      duree: convertedDuration,
      typevehicule: typevehiculeId
    }).subscribe(
      (response) => {
        console.log("Modification enregistrée avec succès :", response);
        this.showSuccessAlert = true;
        setTimeout(() => {
          this.showSuccessAlert = false;
        }, 2000);
      },
      (error) => {
        const errorMessage = error?.error?.msg || 'Une erreur inattendue est survenue.';
        this.errorService.showError(errorMessage);
        console.error("Erreur lors de l'enregistrement :", error);
      }
    );
  }


  getTypeVehiculeId(libelle: string): string | null {
    if (!this.type_vehicules || this.type_vehicules.length === 0) {
      console.warn("Les types de véhicules ne sont pas encore chargés !");
      return null;
    }

    const type = this.type_vehicules.find(t => t.libelle.trim().toLowerCase() === libelle.trim().toLowerCase());

    if (!type) {
      console.warn(`Type de véhicule non trouvé pour libellé: ${libelle}`);
      return null;
    }

    return type._id;
  }



  ajouterHistorique(): void {
    this.newService.historique.push({ date: '', prix: '', duree: '', typevehicule: '' });
  }

  retirerHistorique(index: number): void {
    this.newService.historique.splice(index, 1);
  }

  ajouterService(): void {

    // Vérifier chaque entrée de l'historique
    for (const item of this.newService.historique) {
      if (!item.typevehicule || !item.prix || !item.duree) {
        alert('Veuillez remplir tous les champs pour chaque type de véhicule !');
        return;
      }
      alert(item.duree)
      item.date = new Date().toISOString();
    }
    alert(JSON.stringify(this.newService));
    this.serviceService.addService(this.newService).subscribe(
      (response) => {
        this.services.push(response);
        this.resetForm();
      },
      (error) => {
        const errorMessage = error?.error?.msg || 'Une erreur inattendue est survenue.';
        this.errorService.showError(errorMessage);
        console.error('Erreur lors de l\'ajout du service', error.msg);
      }
    );
  }
  getTypeVehiculeName(typeId: string): string {
    const type = this.type_vehicules.find(t => t._id === typeId);
    return type ? type.libelle : 'Type inconnu';
  }


  resetForm(): void {
    this.newService = {
      nom: '',
      description: '',
      historique: [{ date: new Date().toISOString(), prix: '', duree: '', typevehicule: '' }]
    };
  }

  openServiceModal(service: any): void {
    this.selectedService = { ...service };

    if (this.selectedService?.historique) {
      const derniersHistoriques = new Map(); // Stocke le dernier historique par type

      this.selectedService.historique.forEach((historique: { typevehicule: any; etat: any; date: number; }) => {
        const type = historique.typevehicule;

        // Si on trouve un actif, on le garde et on écrase tout inactif
        if (historique.etat) {
          derniersHistoriques.set(type, historique);
        } else if (!derniersHistoriques.has(type) || historique.date > derniersHistoriques.get(type).date) {
          // Si pas d’actif pour ce type, on garde le dernier inactif
          derniersHistoriques.set(type, historique);
        }
      });

      // Remplace l'historique avec uniquement les bons éléments
      this.selectedService.historique = Array.from(derniersHistoriques.values());
    }
  }


  openUpdateModal(service: any): void {
    this.serviceService.getServiceById(service._id).subscribe((data) => {
      this.selectedService = data; // Mettre à jour selectedService avec toutes les historiques
    }, error => {
      console.error("Erreur lors de la récupération du service :", error);
    });
    // console.log(this.selectedService);
  }



  modifierService(): void {
    this.serviceService.updateService(this.selectedService).subscribe(
      (response) => {
        const index = this.services.findIndex(s => s._id === response._id);
        if (index !== -1) {
          this.services[index] = response;
        }
        this.resetForm();
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du service', error);
      }
    );
  }

  // désactiver un service
  desactiverService(serviceId: string) {
    // if (confirm("Voulez-vous vraiment désactiver ce service ?")) {
      this.serviceService.desactiverService(serviceId).subscribe(() => {
        this.loadServices();
      });
    // }
  }
  activerService(serviceId: string) {
    // if (confirm("Voulez-vous vraiment désactiver ce service ?")) {
      this.serviceService.activerService(serviceId).subscribe(() => {
        this.loadServices();
      });
    // }
  }
  desactiverHistorique(serviceId: string, historiqueId: string) {
    // if (confirm("Voulez-vous vraiment désactiver cet historique ?")) {
      this.serviceService.desactiverHistorique(serviceId, historiqueId).subscribe(() => {
        this.loadServices();
      });
    // }
  }
  toggleHistorique(serviceId: string, historiqueId: string, currentEtat: boolean) {
    const newEtat = !currentEtat; // On inverse l'état actuel
      alert(historiqueId);
    this.serviceService.toggleHistoriqueEtat(serviceId, historiqueId, newEtat).subscribe(
      (response) => {
        console.log(response.message);

        // Mettre à jour l'état dans le frontend
        this.selectedService.historique = this.selectedService.historique.map((h: { _id: string; }) => {
          if (h._id === historiqueId) {
            return { ...h, etat: newEtat };
          }
          return h;
        });
        console.log(this.selectedService.historique);
      },
      (error) => {
        console.error("Erreur lors du changement d'état de l'historique :", error);
      }
    );
  }

   // ajout histo pour un historique
   newHistorique: any[] = [];
  enregistrerHistorique() {
    if (this.selectedService && this.newHistorique.length > 0) {
      const dernierHistorique = this.newHistorique[this.newHistorique.length - 1];

      const historiqueToSend = {
        date: dernierHistorique.date || new Date(),
        prix: dernierHistorique.prix,
        duree: dernierHistorique.duree,
        typevehicule: dernierHistorique.typevehicule?._id || dernierHistorique.typevehicule,
        etat: true
      };

      console.log(historiqueToSend);

      this.serviceService.addHistorique(
        this.selectedService._id,
        historiqueToSend
      ).subscribe({
        next: (nouvelHistorique) => {
          // Ajout immédiat du nouvel historique dans la liste
          this.selectedService.historique.push(nouvelHistorique);
          this.newHistorique = [];
          window.location.reload();
        },
        error: (error) => {
          console.error("Erreur lors de l'ajout de l'historique :", error);
          alert("Une erreur est survenue: " + error.message);
        }
      });
    }
  }


  ajouterHistoriqueD() {
    this.newHistorique.push({ typevehicule: '', prix: 0, duree: 0 });
  }

  retirerHistoriqueD(index: number) {
    this.newHistorique.splice(index, 1);
  }

  // Vérifie s'il existe un historique actif pour un type de véhicule
hasActiveForType(typevehiculeId: string): boolean {
  return this.selectedService?.historique.some((h: { typevehicule: string; etat: any; }) => h.typevehicule === typevehiculeId && h.etat);
}

// Récupère le libellé du type de véhicule
getTypeVehiculeLibelle(typevehiculeId: string): string {
  const typeVehicule = this.type_vehicules.find(t => t._id === typevehiculeId);
  return typeVehicule ? typeVehicule.libelle : "Inconnu";
}


  // partie recherche multi
  filters = {
    service: '',
    typevehicule: '',
    prixMin: null,
    prixMax: null,
    limit: this.itemsPerPage
  };
  searchServices() {
    this.serviceService.searchServices(this.filters).subscribe({
      next: (response) => {
        this.services = response.data.map((service: any) => ({
          ...service,
          historique: service.historique.map((h: any) => ({
            ...h,
            typevehicule: h.typevehicule ? h.typevehicule.libelle : 'Non défini'
          })),
          typevehicules: this.formatTypeVehicules(service.historique
            .filter((h: any) => h.typevehicule) // Filtrer seulement ceux qui ont un typevehicule
            .filter((h:any) => h.etat===true)
            .map((h: any) => h.typevehicule)  // Extraire le typevehicule
          )
        }));
      },
      error: (error) => {
        console.log(error.error.msg);
        this.errorService.showError(error.error.msg);
        // console.error(' Erreur recherche services:', error);
      }
    });
  }


  applyFilters() {
    this.searchServices();
  }
}
