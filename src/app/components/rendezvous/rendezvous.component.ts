import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { RendezvousService } from '../../services/rendezvous.service';
import { AuthService } from '../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { ServiceService } from '../../services/service.service';
import { ErrorService } from '../../services/error.service';
import { FormsModule } from '@angular/forms';
// import { LOCALE_ID, NgModule } from '@angular/core';
@Component({
  selector: 'app-rendezvous',
  standalone: true,
  // providers:{provide: LOCALE_ID, useValue: 'fr-FR'},
  imports: [
    CommonModule,
    FullCalendarModule,
    FormsModule
  ],
  templateUrl: './rendezvous.component.html',
  styleUrls: ['./rendezvous.component.css']
})
export class RendezvousComponent implements OnInit, AfterViewInit, OnDestroy {
  userRole: string | null = '';
  userEmail:string | null='';
  showReservationForm = false;
  calendar!: Calendar;
  services = [];
  servicesDisponibles: any[] = [];
  @ViewChild('calendarContainer', { static: true }) calendarContainer!: ElementRef;
  vehiculesSelectionnes: string[] = [];
  vehiculesDisponibles:any[] = [];
  servicesSelectionnes: any[] = [];


  // rajout rendez vous
  selectedDate: string = ''; // Pour la date sélectionnée
  userId: string = ''; // ID de l'utilisateur connecté (à récupérer depuis l'auth)
  selectedVehiculeId: string = ''; // ID du véhicule sélectionné
  commentaire: string = ''; // Commentaire de l'utilisateur


  // affichage de ses rendez vous
  rendezvousUtilisateur: any[] = [];
  rendezvousDuJour: any[] = [];
  showRendezvousList: boolean = false; // Permet d'afficher la liste au lieu du formulaire
  selectedDateForDetails: string = ''; // Date sélectionnée pour voir les détails

  // détail d'un rendezvous
  detail:boolean = true;
  // partie modifier le rendez vous
selectedServices: { [key: string]: boolean } = {}; // Stocke l'état des cases cochées
rendezvousDetails: any = null; // Stocke les détails du rendez-vous
  email: string = '';

  constructor(
    private serviceService: ServiceService,
    private authService: AuthService,
    private rendezvousService : RendezvousService,
    private errorService: ErrorService,
    private cdr: ChangeDetectorRef
  ) {
    this.userRole = this.authService.getUserRole();
    this.userEmail = this.authService.getUserEmail();
  }


  // affichage
    // partie affichage formattée début
    formatPrix(prix: number): string {
      return new Intl.NumberFormat('fr-FR').format(prix);
    }
    formatDuree(duree: number): string {
      if (duree >= 60) {
        const heures = Math.floor(duree / 60);
        const minutes = duree % 60;
        return minutes > 0 ? `${heures}h ${minutes}min` : `${heures}h`;
      }
      return `${duree} min`;
    }
  ngOnInit(): void {
    this.getVehicules();
    this.getRendezvousUtilisateur();
    console.log(this.detail);
  }
  getVehicules(): void {
    this.rendezvousService.getVehicules().subscribe(
      (response) => {
        console.log(response);
        this.vehiculesDisponibles = response.mesvehicules;
        this.cdr.detectChanges();
      },
      (error) => {
        const errorMessage = error?.error?.msg || 'Une erreur inattendue est survenue.';
        this.errorService.showError(errorMessage);
        console.error('Erreur lors de la récupération des véhicules', error);
      }
    );
  }
  ngAfterViewInit(): void {
    this.initCalendar();
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.calendar) {
      this.calendar.destroy();
    }
  }

  initCalendar(): void {
    if (this.calendarContainer?.nativeElement && !this.calendar) {
      this.calendar = new Calendar(this.calendarContainer.nativeElement, {
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
        timeZone: 'UTC',
        defaultView: 'dayGridMonth',
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        events: [
          { title: 'All Day Event', start: '2024-03-01', color: '#fc9919' },
          { title: 'Long Event', start: '2024-03-07', end: '2024-03-10', color: '#ffc107' },
          { title: 'Meeting', start: '2024-03-12T10:30:00', end: '2024-03-12T12:30:00', color: '#827af3' },
          { title: 'Birthday Party', start: '2024-03-28T07:00:00', color: '#28a745' }
        ]
      });
      this.calendar.render();
    }
  }

  toggleReservationForm() {
    this.showReservationForm = !this.showReservationForm;
  }

  chargerServices(event?: any) {
    if (!this.vehiculesDisponibles.length) {
      this.servicesDisponibles = [];
      return;
    }

    const selectedVehiculeId = event ? event.target.value : null;

    if (selectedVehiculeId) {
      // Charger uniquement les services liés au véhicule sélectionné
      this.rendezvousService.getServicesParVehicule(selectedVehiculeId).subscribe(
        (data) => {
          this.servicesDisponibles = data;
        },
        (error) => {
          console.error('Erreur lors du chargement des services spécifiques au véhicule', error);
        }
      );
    } else {
      // Charger les services disponibles pour tous les véhicules de l'utilisateur
      this.rendezvousService.getServicesDispo().subscribe(
        (data) => {
          this.servicesDisponibles = data;
        },
        (error) => {
          console.error('Erreur lors du chargement des services', error);
        }
      );
    }
  }
  // Ajouter un service à la liste des services sélectionnés
  ajouterService(event: Event) {
    const selectedServiceId = (event.target as HTMLSelectElement).value;

    if (!selectedServiceId) return;

    // Trouver le service correspondant dans la liste des services disponibles
    const selectedService = this.servicesDisponibles.find(service => service._id === selectedServiceId);

    if (selectedService && !this.servicesSelectionnes.some(service => service._id === selectedServiceId)) {
      this.servicesSelectionnes.push(selectedService);
      console.log("Services sélectionnés :", this.servicesSelectionnes);
    }
  }


  // Supprimer un service sélectionné
  retirerService(serviceId: string) {
    this.servicesSelectionnes = this.servicesSelectionnes.filter(s => s._id !== serviceId);
  }


  // reservation
  onVehiculeChange(event: Event) {
    this.selectedVehiculeId = (event.target as HTMLSelectElement).value;
  }

  reserver() {
    const rendezvousData = {
      date: this.selectedDate,
      vehicule: this.selectedVehiculeId,
      services: this.servicesSelectionnes.map(s => s._id),
      commentaire: this.commentaire,
      email:this.email
    };
    // alert(JSON.stringify(rendezvousData, null, 2));
    this.rendezvousService.ajouterRendezvous(rendezvousData).subscribe(response => {
      console.log('Rendez-vous ajouté avec succès', response);
      this.rendezvousDetails = response.prix; // Stocker les détails de prix et durée
      setTimeout(() => {
        const modalButton = document.getElementById('openModalBtn') as HTMLElement;
        if (modalButton) {
          modalButton.click(); // Ouvrir le modal
        }
      }, 100);
    },
      error => {
        console.error('Erreur lors de la réservation', error);
        const errorMessage = error?.error?.message || 'Une erreur inattendue est survenue.';
        this.errorService.showError(errorMessage);
      }
    );
  }

// *affichage des reservations
getRendezvousUtilisateur(): void {
  this.rendezvousService.getRendezvousUtilisateur().subscribe(
    (rendezvous) => {
      this.rendezvousUtilisateur = rendezvous;
      this.updateCalendarEvents();
    },
    (error) => {
      console.error("Erreur lors du chargement des rendez-vous :", error);
    }
  );
}
updateCalendarEvents(): void {
  if (this.calendar) {
    this.calendar.removeAllEvents();
    console.log(this.rendezvousUtilisateur);
    this.rendezvousUtilisateur.forEach(rdv => {
      this.calendar.addEvent({
        title: `Pour ${rdv.vehicule.libelle} - ${rdv.services.map((s: { nom: any; }) => s.nom).join(", ")}`,
        start: rdv.date,
        color: '#007bff',
        extendedProps: { rdv } // Stocke les détails du rendez-vous
      });
    });

    // Gérer le clic sur un événement
    this.calendar.on('eventClick', (info: { event: { extendedProps: { rdv: any; }; }; }) => {
      const selectedRdv = info.event.extendedProps.rdv;
      this.afficherRendezvousDuJour(selectedRdv.date);
    });
  }
}
// getServicesNoms(rdv: any): string {
//   return rdv.services.map((s: { nom: string }) => s.nom).join("et  ");
// }
getServicesNoms(rdv: any): string {
  return rdv.services.map((s: { nom: any; prixEstime: any; dureeEstimee: any; }) => `${s.nom} (${s.prixEstime || 'N/A'} Ar, ${s.dureeEstimee || 'N/A'} min)`).join(', ');
}

afficherRendezvousDuJour(date: string): void {
  this.selectedDateForDetails = date;
  this.rendezvousDuJour = this.rendezvousUtilisateur.filter(rdv =>
    new Date(rdv.date).toDateString() === new Date(date).toDateString()
  );
  this.showRendezvousList = true; // Afficher la liste au lieu du formulaire
}


// partie modifier le rendez vous

// confirmation du rendezvous
toggleSelection(serviceId: string, event: Event): void {
  const checked = (event.target as HTMLInputElement).checked;
  this.selectedServices[serviceId] = checked;
  console.log(`Service ${serviceId} coché :`, checked);
}

confirmRendezVous(): void {
  if (!this.rendezvousDetails || !this.rendezvousDetails.details) {
    console.error("Aucun détail de rendez-vous disponible !");
    return;
  }

  // Récupérer les services NON cochés
  const servicesRestants = this.rendezvousDetails.details.filter((service: { _id: string | number; }) =>
    !this.selectedServices[service._id]
  );


  if (servicesRestants.length === 0) {
    console.warn("⚠ Tous les services ont été supprimés, annulation de l'envoi.");
    return;
  }

  // Construire l'objet `rendezvousData` avec la structure correcte
  const rendezvousData = {
    date: this.selectedDate,
    vehicule: this.selectedVehiculeId,
    services: servicesRestants.map((s: { _id: any; }) => s._id),
    commentaire: this.commentaire,
    email:this.email
  };


  // Envoyer les services restants
  this.rendezvousService.confirmerRendezvous(rendezvousData).subscribe(
    response => {
      console.log("Rendez-vous mis à jour avec succès !", response);
    },
    error => {
      console.error("Erreur lors de la mise à jour du rendez-vous :", error);
    }
  );
}

}
