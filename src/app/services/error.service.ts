import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  errorMessage = signal<string>('');

  constructor(private authService: AuthService, private router: Router) {}

  showError(message: string) {
    console.log("ato showerror");
    this.errorMessage.set(message);
  }

  clearError() {
    this.errorMessage.set('');
    console.log("ato clearError");
  }


  handleLogout() {
    this.authService.logout();
    this.clearError();
    this.router.navigate(['/login']);
  }
}
