import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorModalComponent } from '../error/error.component';

@Component({
  selector: 'app-rendezous-manager',
  imports: [],
  templateUrl: './rendezous-manager.component.html',
  styleUrl: './rendezous-manager.component.css'
})
export class RendezvousManagerComponent
implements OnInit{
 @ViewChild(ErrorModalComponent) errorModal!: ErrorModalComponent;
 ngOnInit(): void {
     
 }
}
