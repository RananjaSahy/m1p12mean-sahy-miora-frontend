import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UtilisateursService } from '../../services/utilisateurs.service';
import { ActionService } from '../../services/action.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-action-mecano',
  imports: [CommonModule],
  templateUrl: './action-mecano.component.html',
  styleUrl: './action-mecano.component.css'
})
export class ActionMecanoComponent {
  actions: any[] = [];
  actionselectionne: any = null;

  errormessage = '';
  successmessage = '';

  constructor(
    private authservice: AuthService, private actionservice : ActionService
  ) {}

  ngOnInit(): void {
      this.loadActions();
  }

  loadActions() {
    this.actionselectionne = null;
    this.actionservice.getActions()
      .subscribe((data) => {
        this.actions = data;
        this.errormessage = '';
      }, (error) => {
        this.errormessage = 'Erreur lors du chargement des actions';
        console.error('Erreur lors du chargement des actions', error);
      });
  }

  selectAction(action: any) {
    this.actionselectionne = this.actionselectionne === action ? null : action;
  }

  mettreEnCours() {
    if (!this.actionselectionne) return;
    this.clearMessages();
    this.actionservice.setActionEncours(this.actionselectionne._id).subscribe({
      next: (res) => {
        this.showSuccess(res.message);
        this.loadActions();
      },
      error: (err) => {
        this.errormessage = err.error?.error || 'Erreur lors du changement de statut';
        console.error(err);
      }
    });
  }

  terminerAction() {
    if (!this.actionselectionne) return;
    this.clearMessages();
    this.actionservice.terminerAction(this.actionselectionne._id).subscribe({
      next: (res) => {
        this.showSuccess(res.message);
        this.loadActions();
      },
      error: (err) => {
        this.errormessage = err.error?.error || 'Erreur lors de la terminaison';
        console.error(err);
      }
    });
  }

  annulerAction() {
    if (!this.actionselectionne) return;
    this.clearMessages()
    this.actionservice.annulerAction(this.actionselectionne._id).subscribe({
      next: (res) => {
        this.showSuccess(res.message);
        this.loadActions();
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
        this.loadActions();
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
