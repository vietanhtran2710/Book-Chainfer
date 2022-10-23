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
  userSellingTokens: Array<any> = [];
  otherSellingTokens: Array<any> = [];

  constructor(private blockchainService: BlockchainService,
              private authService: AuthService,
              private tokenService: TokenService) { 
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
        this.tokenService.getAll().subscribe(
          (result: any) => {
            this.blockchainService.getSellingToken(result)
            .then((tokens: any) => {
              console.log(tokens);
              for (let item of tokens) {
                if (tokens.owner == this.userAddress) {
                  this.userSellingTokens.push(item);
                }
                else {
                  this.otherSellingTokens.push(item);
                }
              }
            })
          }
        )
      })
    }
  }

  ngOnInit(): void {
  }

}
