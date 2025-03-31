import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UtilisateursService } from '../../services/utilisateurs.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mesactions',
  imports: [CommonModule],
  templateUrl: './mesactions.component.html',
  styleUrl: './mesactions.component.css'
})
export class MesactionsComponent {
  mesactions: any[] = [];
  actionselectionne: any = null;

  errormessage = '';

  constructor(
    private authservice: AuthService, private utilisateurservice : UtilisateursService
  ) {}

  ngOnInit(): void {
      this.loadMesActions();
  }

  loadMesActions() {
    this.utilisateurservice.getMesactions()
      .subscribe((data) => {
        this.mesactions = data;
      }, (error) => {
        this.errormessage = 'Erreur lors du chargement de mes actions';
        console.error('Erreur lors du chargement des mes actions', error);
      });
  }

  selectAction(action: any) {
    this.actionselectionne = this.actionselectionne === action ? null : action;
  }

}
