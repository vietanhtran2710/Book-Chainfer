import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BlockchainService } from '../services/blockchain.service';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

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
  marketModel: FormGroup

  constructor(private blockchainService: BlockchainService,
              private authService: AuthService,
              private tokenService: TokenService,
              private fb: FormBuilder) { 
    if (Object.keys(this.authService.currentUserValue).length !== 0) {
      this.authService.verifyToken().pipe(catchError(err => {
        return throwError(err);
      })).subscribe((data: any) => {
        this.userAddress = data.address;
        this.blockchainService.getPageBalance(this.userAddress)
        .then((result: any) => {
          this.balance = result;
        })
        this.tokenService.getAll().subscribe(
          (result: any) => {
            this.blockchainService.getSellingToken(result)
            .then((tokens: any) => {
              for (let item of tokens) {
                if (item.owner.toLowerCase() == this.userAddress.toLowerCase()) {
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
    this.marketModel = this.fb.group({
      tokenID: '',
      bookTitle: '',
      marketPrice: '',
    })
  }

  ngOnInit(): void {
  }

  updateMarketModalInfo(bookInfo: any) {
    console.log(bookInfo);
    this.marketModel.setValue({
      bookTitle: bookInfo.book.name, 
      tokenID: bookInfo.id,
      marketPrice: bookInfo.price
    })
  }

  updateMarketInfo() {
    let tokenID = this.marketModel.get('tokenID')?.value;
    let newPrice = this.marketModel.get('marketPrice')?.value;
    this.blockchainService.setTokenPrice(
      tokenID, newPrice, this.userAddress
    )
    .then((result) => {
      if (newPrice != 0) {
        this.tokenService.createToken({
          tokenId: tokenID,
          bookId: tokenID
        }).subscribe((result) => {
          console.log(result);
          Swal.fire({
            icon: 'success',
            title: 'Done',
            text: `Market infomation updated successfully`
          })
        })
      }
      else {
        this.tokenService.delete(tokenID).subscribe(
          (result) => {
            Swal.fire({
              icon: 'success',
              title: 'Done',
              text: `Market infomation updated successfully`
            })
          }
        )
      }
    })
    .catch((err) => {

    })
  }

  buyBook(token: any) {

  }

}
