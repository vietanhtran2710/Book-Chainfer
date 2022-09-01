import { Component, OnInit } from '@angular/core';
import { BlockchainService } from '../services/blockchain.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-owned',
  templateUrl: './owned.component.html',
  styleUrls: ['./owned.component.css']
})
export class OwnedComponent implements OnInit {
  ownedTokens: Array<any> = [];
  pageUser: string = '';

  constructor(
    private blockchainService: BlockchainService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.pageUser = this.authService.currentUserValue.address;
    this.blockchainService.getUserOwnedTokenInfo(this.pageUser)
    .then((result: any) => {
      this.ownedTokens = result;
    });
  }

}
