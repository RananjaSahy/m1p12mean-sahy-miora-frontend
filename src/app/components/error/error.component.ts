import { Component, computed, effect } from '@angular/core';
import { ErrorService } from '../../services/error.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  templateUrl: './error.component.html',
  imports: [NgIf],
  styleUrls: ['./error.component.css'],
})
export class ErrorModalComponent {
  errorMessage = computed(() => this.errorService.errorMessage());
  shouldLogout = computed(() => this.errorMessage().toLowerCase().includes("token invalide"));
  constructor(private errorService: ErrorService) {}

  closeModal() {
    this.errorService.clearError();
  }
  handleLogout(){
    this.errorService.handleLogout();
  }
}
