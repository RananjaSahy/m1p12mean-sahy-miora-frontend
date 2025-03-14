import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorModalComponent } from './components/error/error.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ErrorModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'm1p12mean-sahy-miora-frontend';
}
