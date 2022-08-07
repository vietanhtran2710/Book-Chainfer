import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService) {
    if (Object.keys(this.authService.currentUserValue).length === 0) {
      window.location.replace('')
    }
   }

  ngOnInit(): void {
  }

  logOut() {
    this.authService.logout();
  }

}
