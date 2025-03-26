import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UtilisateursService } from '../../services/utilisateurs.service';
import { TypevehiculesService } from '../../services/typevehicules.service';

@Component({
  selector: 'app-typevehicules',
  imports: [CommonModule, FormsModule],
  templateUrl: './typevehicules.component.html',
  styleUrl: './typevehicules.component.css'
})
export class TypevehiculesComponent {
  typevehicules: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  limit: number = 5;
  totalTypevehicule: number = 0;

  errormessage = '';
  errorajout = { msg: '' };
  newtype = { libelle: '', description: '' };
  successAjout = '';
  searchSubject: Subject<string> = new Subject<string>();

  constructor(
    private authservice: AuthService, private typevehiculeservice: TypevehiculesService 
  ) {}

  ngOnInit(): void {
      this.loadTypevehicules();

      this.searchSubject.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(() => {
        this.currentPage = 1;
        this.loadTypevehicules();
      });
  }

  ajouterNewType(): void {
    this.reinitialiserAlertAjout();
    const { libelle } = this.newtype;

    if (
      !libelle?.trim()
    ) {
      this.errorajout.msg = 'Le champ libellé est obligatoire.';
      return;
    }
    this.typevehiculeservice.ajouterType(this.newtype).subscribe({
      next: (response) => {
        this.successAjout = 'Type véhicule ajouté avec succes';
        this.newtype = { libelle:'', description:'' };
        this.loadTypevehicules();
      },
      error: (err) => {
        this.errorajout.msg = err.message || "Erreur lors de l'ajout";
      },
    });
  }

  reinitialiserAlertAjout():void {
    this.errorajout.msg = '';
    this.successAjout = '';
  }

  loadTypevehicules() {
    this.typevehiculeservice.getTypevehicules(this.currentPage, this.limit, this.searchTerm)
      .subscribe((data) => {
        this.typevehicules = data.typevehicules;
        this.totalTypevehicule = data.total;
      }, (error) => {
        this.errormessage = 'Erreur lors du chargement des mécaniciens';
        console.error('Erreur lors du chargement des mécaniciens', error);
      });
  }

  onSearch() {
    this.currentPage = 1;
    this.searchSubject.next(this.searchTerm);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadTypevehicules();
  }

  get totalPages(): number[] {
    return Array.from({ length: Math.ceil(this.totalTypevehicule / this.limit) }, (_, i) => i + 1);
  }
}
