import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../../services/service.service'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ErrorModalComponent } from '../error/error.component';
@Component({
  selector: 'app-services',
  imports: [CommonModule, FormsModule], // Ajoute FormsModule ici
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  @ViewChild(ErrorModalComponent) errorModal!: ErrorModalComponent;
  userRole: string | null = '';
  services: any[] = [];
  newService: any = { nom: '', description: '',historique:[{
    date:'',
    prix:''
  }] };
  selectedService: any = {
    nom: '',
    description: '',
    historique: [
      {
        date: new Date().toISOString(), // Date actuelle
        prix: ''
      }
    ]
  };

  constructor(private serviceService: ServiceService,private authService: AuthService) {
    this.userRole = this.authService.getUserRole();
  }

  ngOnInit(): void {
    this.serviceService.getServices().subscribe(data => {
      this.services = data;
    });
  }
  ajouterService(): void {
    if (!this.newService.nom || !this.newService.description || !this.newService.historique[0].prix) {
      alert('Veuillez remplir tous les champs !');
      return;
    }
    this.newService.historique[0].date = new Date().toISOString();

    // Appel du service pour ajouter le service
    this.serviceService.addService(this.newService).subscribe(
      (response) => {
        this.services.push(response);
        this.resetForm();
      },
      (error) => {
        const errorMessage = error?.error?.message || 'Une erreur inattendue est survenue.';
        this.errorModal.showError(errorMessage);
        console.error('Erreur lors de l\'ajout du service', error);
      }
    );
  }
  resetForm(): void {
    this.newService = {
      nom: '',
      description: '',
      historique: [
        {
          date: new Date().toISOString(),
          prix: ''
        }
      ]
    };
  }
  openUpdateModal(service: any): void {
    this.selectedService = { ...service };
  }
  modifierService(): void {
    this.serviceService.updateService(this.selectedService).subscribe(
      (response) => {
        const index = this.services.findIndex(s => s._id === response._id);
        if (index !== -1) {
          this.services[index] = response; // Mettre à jour la liste locale
        }
        this.resetForm();
      },
      (error) => {
        console.error("Erreur lors de la mise à jour du service", error);
      }
    );
  }


}
