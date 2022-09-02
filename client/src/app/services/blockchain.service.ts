import { Injectable } from '@angular/core';
const Web3 = require('web3')


@Injectable({
  providedIn: 'root'
})
export class BlockchainService {

  private web3: any;
  private artifacts = require('../../../../build/contracts/NFTOwnership.json');
  private contractABI = this.artifacts.abi;
  private contractAddress = this.artifacts.networks["5777"].address
  private contract: any;

  constructor() { 
    this.initWeb3();
  }

  async initWeb3() {
    this.web3 = new Web3(Web3.givenProvider || '"ws://localhost:7545"');
    this.contract = await new this.web3.eth.Contract(this.contractABI, this.contractAddress);
  }

  createBook(name: string, currentAccount: string) {
    let that = this;
    return new Promise((resolve, reject) => {
      that.contract.methods.createBook(name).send({from: currentAccount})
      .then((result: any) => {
        return resolve(result);
      })
    })
  }

  authorizeToken(toAddress: string, tokenId: number, right: number, currentAccount: string) {
    let that = this;
    return new Promise((resolve, reject) => {
      that.contract.methods.transferRight(toAddress, tokenId, right).send({from: currentAccount})
      .then((result: any) => {
        return resolve(result);
      })
    })
  }

  async getUserOwnedTokenInfo(account: string) {
    type TokenInfo = {
      tokenId?: number;
      bookId?: number;
      bookTitle?: string;
      right?: number;
    };
    let that = this;
    await this.initWeb3();
    return new Promise((resolve, reject) => {
      that.contract.methods.balanceOf(account).call()
      .then(function(result: any) {
        let balance = result;
        let promises: Array<Promise<any>> = []
        for (let i = 0; i < balance; i++) {
          promises.push(that.contract.methods.tokenOfOwnerByIndex(account, i).call());
        }
        Promise.all(promises).then(values => {
          let tokensInfo = values.map((id) => {
            let info: TokenInfo = { tokenId: id };
            return info
          });
          let promises: Array<Promise<any>> = []
          for (let item of tokensInfo) {
            promises.push(
              that.contract.methods.getTokenBook(item.tokenId).call()
            );
          }
          Promise.all(promises).then(values => {
            for (var i = 0; i < values.length; i++) {
              tokensInfo[i].bookId = values[i];
            }
            let promises: Array<Promise<any>> = [];
            for (let item of tokensInfo) {
              promises.push(
                that.contract.methods.getBookTitle(item.bookId).call()
              );
            }
            Promise.all(promises).then(titles => {
              for (var i = 0; i < titles.length; i++) {
                tokensInfo[i].bookTitle = titles[i];
              }
              let promises: Array<Promise<any>> = [];
              for (let item of tokensInfo) {
                promises.push(
                  that.contract.methods.getTokenRight(item.tokenId).call()
                );
              }
              Promise.all(promises).then(rights => {
                for (var i = 0; i < rights.length; i++) {
                  tokensInfo[i].right = rights[i];
                }
                return resolve(tokensInfo);
              })
            })
          })
        });
      })
    })
  }
}
