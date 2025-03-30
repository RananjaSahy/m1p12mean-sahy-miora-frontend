import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilisateursService } from '../../services/utilisateurs.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-mecaniciens',
  imports: [CommonModule, FormsModule],
  templateUrl: './mecaniciens.component.html',
  styleUrl: './mecaniciens.component.css'
})
export class MecaniciensComponent implements OnInit{
  mecaniciens: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  limit: number = 5;
  totalMecaniciens: number = 0;

  errormessage = '';
  errorajout = { msg: '' };
  user = { nom: '', prenom: '', email: '', mdp: '', mdpconfirm: '' };
  successAjout = '';
  searchSubject: Subject<string> = new Subject<string>();

  constructor(
    private authservice: AuthService, private utilisateurService: UtilisateursService
  ) {}

  ngOnInit(): void {
      this.loadMecaniciens();

      this.searchSubject.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(() => {
        this.currentPage = 1;
        this.loadMecaniciens();
      });
  }

  ajouterUser(): void {
    this.reinitialiserAlertAjout();
    const { email, mdp, nom, prenom, mdpconfirm } = this.user;

    if (
      ![email, mdp, nom, prenom, mdpconfirm].every((field) => field?.trim())
    ) {
      this.errorajout.msg = 'Veuillez remplir tous les champs.';
      return;
    }
    if (mdp !== mdpconfirm) {
      this.errorajout.msg = 'Les mots de passe ne correspondent pas.';
      return;
    }
    this.authservice.registermecanicien(this.user).subscribe({
      next: (response) => {
        console.log(response)
        this.successAjout = response.msg;
        this.user = { nom: '', prenom: '', email: '', mdp: '', mdpconfirm: '' };
        this.loadMecaniciens();
      },
      error: (err) => {
        console.log(err);
        this.errorajout.msg = err.error.msg || "Erreur lors de l'inscription";
      },
    });
  }

  reinitialiserAlertAjout():void {
    this.errorajout.msg = '';
    this.successAjout = '';
  }

  loadMecaniciens() {
    this.utilisateurService.getMecaniciens(this.currentPage, this.limit, this.searchTerm)
      .subscribe((data) => {
        this.mecaniciens = data.mecaniciens;
        this.totalMecaniciens = data.total;
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
    this.loadMecaniciens();
  }

  get totalPages(): number[] {
    return Array.from({ length: Math.ceil(this.totalMecaniciens / this.limit) }, (_, i) => i + 1);
  }

}
