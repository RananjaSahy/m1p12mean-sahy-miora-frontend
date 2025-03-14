import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-loginstaff',
  imports: [CommonModule, FormsModule],
  templateUrl: './loginstaff.component.html',
  styleUrl: './loginstaff.component.css'
})
export class LoginstaffComponent {
  error = {msg:''};
  user = {email: '', mdp:''};

  constructor(private authservice: AuthService,private router: Router, private cdRef: ChangeDetectorRef) {}

  loginUser():void{
    this.error.msg = '';
    if (this.user.email && this.user.mdp) {
      this.authservice.loginstaff(this.user).subscribe({
        next:(response) => {
          this.authservice.storeToken(response.token);
          this.router.navigate(['/']);
        },
        error:(err) => {
          this.error.msg = err.msg || 'Email ou mot de passe incorrect.';
        }
      });
    }else{
      this.error.msg = 'Veuillez remplir tous les champs.';
    }
  }
}
