import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { BlockchainService } from '../services/blockchain.service';
import { TokenService } from '../services/token.service';
import { Account } from '../_model/account';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentAccount: Account = new Account;
  userAddress: string = '';
  currentToken: number = 0;
  vndPay: number = 0;
  tokenReceived: number = 0;
  constructor(private authService: AuthService,
              private blockchainService: BlockchainService,
              private tokenService: TokenService,
              private router: Router) { }

  ngOnInit() {
    if (Object.keys(this.authService.currentUserValue).length !== 0) {
      this.authService.verifyToken().pipe(catchError(err => {
        return throwError(err);
      })).subscribe((data: any) => {
        this.userAddress = data.address;
      })
    }
  }

  logOut() {
    this.authService.logout();
  }

  buyToken() {
    // Swal.fire({
    //   title: 'Transfering tokens',
    //   html: 'Please be patient',
    //   timerProgressBar: false,
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // })
    this.tokenService.buyToken({amount: this.tokenReceived}).subscribe(
      result => {
        console.log(result);
        Swal.fire({
          icon: 'success',
          title: 'Done',
          text: 'Token bought successfully'
        })
        .then(result => {
          location.reload();
        })
      }
    )
  }

  calculateToken() {
    this.tokenReceived = this.vndPay / 1000;
  }
}
