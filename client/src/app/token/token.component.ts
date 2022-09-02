import { Component, OnInit } from '@angular/core';
import { BlockchainService } from '../services/blockchain.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit {
  ownedTokens: Array<any> = [];
  publishTokens: Array<any> = [];
  readTokens: Array<any> = [];
  pageUser: string = '';

  constructor(
    private blockchainService: BlockchainService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.pageUser = this.authService.currentUserValue.address;
    this.blockchainService.getUserOwnedTokenInfo(this.pageUser)
    .then((result: any) => {
      console.log(result);
      for (let item of result) {
        if (item.right == "0") this.ownedTokens.push(item)
        else if (item.right == "1") this.publishTokens.push(item)
        else this.readTokens.push(item)
      }
    });
  }

}
