import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit{
  userRole: string | null = '';
  constructor(private authService: AuthService) {
      this.userRole = this.authService.getUserRole();
    }
    ngOnInit(): void {
    }
    logout():void{
      this.authService.logout();
    }
}
