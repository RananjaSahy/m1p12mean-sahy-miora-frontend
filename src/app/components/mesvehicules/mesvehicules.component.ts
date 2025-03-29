import { Component } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { TypevehiculesService } from '../../services/typevehicules.service';
import { VehiculesService } from '../../services/vehicules.service';
import { UtilisateursService } from '../../services/utilisateurs.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mesvehicules',
  imports: [FormsModule, CommonModule],
  templateUrl: './mesvehicules.component.html',
  styleUrl: './mesvehicules.component.css'
})
export class MesvehiculesComponent {
  mesvehicules: any[] = [];
  typevehicules: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  limit: number = 5;
  totalVehicule: number = 0;

  errormessage = '';
  errorajout = { msg: '' };
  newvehicule = { matricule:'', libelle: '', description: '', typevehicule:null };
  successAjout = '';
  searchSubject: Subject<string> = new Subject<string>();

  constructor(
    private authservice: AuthService, private typevehiculeservice: TypevehiculesService, private vehiculeservice: VehiculesService, private utilisateurservice : UtilisateursService
  ) {}

  ngOnInit(): void {
      this.loadTypevehicules();
      this.loadMesVehicules();
      this.searchSubject.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(() => {
        this.currentPage = 1;
        this.loadMesVehicules();
      });
  }

  ajouterNewVehicule(): void {
    this.reinitialiserAlertAjout();
    const { libelle } = this.newvehicule;

    if (
      !libelle?.trim()
    ) {
      this.errorajout.msg = 'Le champ libellé est obligatoire.';
      return;
    }
    if (this.newvehicule.typevehicule === '') {
      this.newvehicule.typevehicule = null;
    }
    this.vehiculeservice.postVehicule(this.newvehicule).subscribe({
      next: (response) => {
        this.successAjout = 'Véhicule ajouté avec succes';
        this.newvehicule = { matricule:'', libelle: '', description: '', typevehicule:null };
        this.loadMesVehicules();
      },
      error: (err) => {
        this.errorajout.msg = err.error.message || "Erreur lors de l'ajout";
      },
    });
  }

  reinitialiserAlertAjout():void {
    this.errorajout.msg = '';
    this.successAjout = '';
  }

  loadTypevehicules() {
    this.typevehiculeservice.getTypevehicules()
      .subscribe((data) => {
        this.typevehicules = data.typevehicules;
      }, (error) => {
        this.errormessage = 'Erreur lors du chargement des types de véhicule';
        console.error('Erreur lors du chargement des types de véhicule', error);
      });
  }

  loadMesVehicules() {
    this.utilisateurservice.getMesvehicules(this.currentPage, this.limit, this.searchTerm)
      .subscribe((data) => {
        this.mesvehicules = data.mesvehicules;
        this.totalVehicule = data.total;
      }, (error) => {
        this.errormessage = 'Erreur lors du chargement des véhicules';
        console.error('Erreur lors du chargement des des véhicules', error);
      });
  }

  onSearch() {
    this.currentPage = 1;
    this.searchSubject.next(this.searchTerm);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadMesVehicules();
  }

  get totalPages(): number[] {
    return Array.from({ length: Math.ceil(this.totalVehicule / this.limit) }, (_, i) => i + 1);
  }
}
