import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UtilisateursService } from '../../services/utilisateurs.service';
import { CommonModule } from '@angular/common';
import { ActionService } from '../../services/action.service';

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
  successmessage = '';

  constructor(
    private authservice: AuthService, private utilisateurservice : UtilisateursService, private actionservice : ActionService
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

  annulerAction() {
    if (!this.actionselectionne) return;
    this.clearMessages();
    this.actionservice.annulerAction(this.actionselectionne._id).subscribe({
      next: (res) => {
        this.showSuccess(res.message);
        this.loadMesActions();
      },
      error: (err) => {
        this.errormessage = err.error?.error || 'Erreur lors de l’annulation';
        console.error(err);
      }
    });
  }
  replannifierAction() {
    if (!this.actionselectionne) return;
    this.clearMessages()
    this.actionservice.replannifierAction(this.actionselectionne._id).subscribe({
      next: (res) => {
        this.showSuccess(res.message);
        this.loadMesActions();
      },
      error: (err) => {
        this.errormessage = err.error?.error || 'Erreur lors de l’annulation';
        console.error(err);
      }
    });
  }

  private showSuccess(message: string) {
    this.successmessage = message;
    setTimeout(() => {
      this.successmessage = '';
    }, 4000);
  }

  private clearMessages() {
    this.errormessage = '';
    this.successmessage = '';
  }
}
