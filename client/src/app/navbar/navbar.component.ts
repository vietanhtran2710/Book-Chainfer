import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Account } from '../_model/account';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentAccount: Account = new Account;
  userAddress: string = '';
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.currentAccount = this.authService.currentUserValue
    this.userAddress = this.authService.currentUserValue.address
  }

  logOut() {
    this.authService.logout();
  }
}
