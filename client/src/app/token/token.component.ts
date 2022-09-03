import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BlockchainService } from '../services/blockchain.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router'
import Swal from 'sweetalert2';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit {
  ownedTokens: Array<any> = [];
  publishTokens: Array<any> = [];
  readTokens: Array<any> = [];
  userAddress: string = '';
  pageAddress: string = '';
  authorizeModel: FormGroup

  constructor(
    private blockchainService: BlockchainService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    if (Object.keys(this.authService.currentUserValue).length === 0) {
      window.location.replace('')
    }
    else {
      let that = this;
      this.authService.verifyToken().pipe(catchError(err => {
        return throwError(err);
      })).subscribe((data: any) => {
        that.userAddress = data.address;
      })
    }
    this.authorizeModel = this.fb.group({
      toAddress: '',
      tokenType: '',
      bookTitle: '',
      tokenId: '',
    })
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.pageAddress = params.get('user')!;
      this.blockchainService.getUserOwnedTokenInfo(this.pageAddress)
      .then((result: any) => {
        for (let item of result) {
          if (item.right == "0") this.ownedTokens.push(item)
          else if (item.right == "1") this.publishTokens.push(item)
          else this.readTokens.push(item)
        }
      });
    })
  }

  authorizeToken() {
    let right;
    if (this.authorizeModel.get('tokenType')?.value == 'Publish') {
      right = 1;
    }
    else { right = 2; }
    this.blockchainService.authorizeToken(
      this.authorizeModel.get('toAddress')?.value,
      this.authorizeModel.get('tokenId')?.value,
      right,
      this.userAddress
    ).then((result: any) => {
      if (result) {
        Swal.fire({
          icon: 'success',
          title: 'Done',
          text: `${this.authorizeModel.get('tokenType')?.value} token created successfully`
        })
      }
    })
  }

  updateModalInfo(type: number, tokenInfo: any) {
    console.log(type, tokenInfo)
    let right;
    if (type == 1) {
      right = 'Publish'
    }
    else { right = 'Read' }
    this.authorizeModel.setValue({
      tokenType: right, 
      bookTitle: tokenInfo.bookTitle, 
      toAddress: this.authorizeModel.get('toAddress')?.value,
      tokenId: tokenInfo.tokenId
    })
  }

}
