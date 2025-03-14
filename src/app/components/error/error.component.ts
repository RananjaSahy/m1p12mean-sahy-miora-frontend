import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-error-modal',
  imports:[NgIf],
  templateUrl: './error.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent {
  errorMessage: string = '';

  showError(message: string) {
    this.errorMessage = message;
  }

  closeModal() {
    this.errorMessage = '';
  }
}
