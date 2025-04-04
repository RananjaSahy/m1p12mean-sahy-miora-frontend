import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent{

  error = {msg:''};
  user = {email: 'sahyrananja@gmail.com', mdp:'123456'};

  constructor(private authservice: AuthService,private router: Router, private cdRef: ChangeDetectorRef) {}

  loginUser():void{
    this.error.msg = '';
    if (this.user.email && this.user.mdp) {
      this.authservice.loginclient(this.user).subscribe({
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
