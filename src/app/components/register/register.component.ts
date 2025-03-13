import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  error = { msg: '' };
  user = { nom: '', prenom: '', email: '', mdp: '', mdpconfirm: '' };
  success = '';
  constructor(
    private authservice: AuthService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  registerUser(): void {
    this.error.msg = '';
    this.success = '';
    const { email, mdp, nom, prenom, mdpconfirm } = this.user;

    if (
      ![email, mdp, nom, prenom, mdpconfirm].every((field) => field?.trim())
    ) {
      this.error.msg = 'Veuillez remplir tous les champs.';
      return;
    }
    if (mdp !== mdpconfirm) {
      this.error.msg = 'Les mots de passe ne correspondent pas.';
      return;
    }
    this.authservice.registerclient(this.user).subscribe({
      next: (response) => {
        this.success = response.msg;
      },
      error: (err) => {
        this.error.msg = err.msg || "Erreur lors de l'inscription";
      },
    });
  }
}
