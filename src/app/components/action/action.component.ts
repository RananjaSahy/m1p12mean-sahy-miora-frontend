import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ActionService } from '../../services/action.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilisateursService } from '../../services/utilisateurs.service';

@Component({
  selector: 'app-action',
  imports:[CommonModule,RouterModule,FormsModule],
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent implements OnInit {
  actions: any[] = [];
  rendezvousId: string | null = null;
  mecanos: any[] = [];
  selectedActionId: string = '';
  selectedResponsableId: string = '';
  selectedAction: any = null; // Action sélectionnée
  constructor(
    private actionService: ActionService,
    private route: ActivatedRoute,
    private utilisateurService: UtilisateursService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.rendezvousId = params.get('id');
      if (this.rendezvousId) {
        this.loadActionsByRendezvous(this.rendezvousId);
      } else {
        this.loadActions();
      }
    });
    this.loadMecaniciens();
    console.log(this.actions);
  }

  loadActions(): void {
    this.actionService.getActions().subscribe(data => {
      this.actions = data;
    });
  }

  loadActionsByRendezvous(id: string): void {
    this.actionService.getActionsByRendezvous(id).subscribe(data => {
      this.actions = data;
    });
  }

  getActionsByStatus(status: number): any[] {
    if (!this.actions || !Array.isArray(this.actions)) {
      console.log("getActionsByStatus")
      return []; // Retourne un tableau vide si `this.actions` n'est pas un tableau
    }
    return this.actions.filter(action => action.statutActuel?.etat === status);
  }


  loadMecaniciens() {
    this.utilisateurService.getMecaniciens()
      .subscribe((data) => {
        this.mecanos = data.mecaniciens;
      }, (error) => {
        console.error('Erreur lors du chargement des mécaniciens', error);
      });
  }

  openModal(action: any) {
    this.selectedAction = { ...action };
    this.selectedActionId = action._id;
    console.log("this.selectedAction  = ",this.selectedAction );
    this.cdr.detectChanges();
    console.log("selecte = ",this.selectedAction);
  }


  addResponsable() {
    if (!this.selectedActionId || !this.selectedResponsableId) console.log("tsisy");

    this.actionService
      .updateAction(this.selectedActionId, { responsables: [this.selectedResponsableId] })
      .subscribe((updatedAction) => {
        this.actions = this.actions.map(action =>
          action._id === updatedAction._id ? updatedAction : action
        );
      });
  }
  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR').format(prix);
  }
}
