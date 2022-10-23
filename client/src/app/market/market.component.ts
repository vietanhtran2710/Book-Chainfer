import { Component, OnInit } from '@angular/core';
import { BlockchainService } from '../services/blockchain.service';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {

  balance: number = 0;
  userAddress: string = '';

  constructor(private blockchainService: BlockchainService,
              private authService: AuthService) { 
    if (Object.keys(this.authService.currentUserValue).length === 0) {
      window.location.replace('')
    }
    else {
      let that = this;
      this.authService.verifyToken().pipe(catchError(err => {
        window.location.replace('')
        return throwError(err);
      })).subscribe((data: any) => {
        this.userAddress = data.address;
        let that = this;
        this.blockchainService.getPageBalance(this.userAddress)
        .then((result: any) => {
          that.balance = result;
        })
      })
    }
  }

  ngOnInit(): void {
  }

}
