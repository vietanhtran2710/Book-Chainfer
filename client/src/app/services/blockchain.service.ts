import { Injectable } from '@angular/core';
const Web3 = require('web3')


@Injectable({
  providedIn: 'root'
})
export class BlockchainService {

  private web3: any;
  private nftArtifacts = require('../../../../build/contracts/NFTOwnership.json');
  private nftContractABI = this.nftArtifacts.abi;
  private nftContractAddress = this.nftArtifacts.networks["5777"].address
  private nftContract: any;

  private pageArtifacts = require('../../../../build/contracts/PageToken.json');
  private pageContractABI = this.pageArtifacts.abi;
  private pageContractAddress = this.pageArtifacts.networks["5777"].address
  private pageContract: any;

  constructor() { 
    this.initWeb3();
  }

  async initWeb3() {
    this.web3 = new Web3(Web3.givenProvider || '"ws://localhost:7545"');
    this.nftContract = await new this.web3.eth.Contract(this.nftContractABI, this.nftContractAddress);
    this.pageContract = await new this.web3.eth.Contract(this.pageContractABI, this.pageContractAddress);
  }

  async getPageBalance(account: string) {
    await this.initWeb3();
    let that = this;
    return new Promise((resolve, reject) => {
      that.pageContract.methods.balanceOf(account).call()
      .then((result: any) => {
        return resolve(result);
      })
    })
  }

  async getSellingToken(tokens: Array<any>) {
    await this.initWeb3();
    let that = this;
    return new Promise((resolve, reject) => {
      let promises: Array<Promise<any>> = [];
      for (let item of tokens) {
        promises.push(that.nftContract.methods.ownerOf(item.id).call());
      }
      Promise.all(promises).then(owners => {
        for (var i = 0; i < owners.length; i++) {
          tokens[i].owner = owners[i];
        }
        let promises: Array<Promise<any>> = [];
        for (let item of tokens) {
          promises.push(that.nftContract.methods.getTokenPrice(item.id).call());
        }
        Promise.all(promises).then(prices => {
          for (var i = 0; i < prices.length; i++) {
            tokens[i].price = prices[i];
          }
          return resolve(tokens);
        })
      })
    })
  }

  createBook(name: string, currentAccount: string) {
    let that = this;
    return new Promise((resolve, reject) => {
      that.nftContract.methods.createBook(name).send({from: currentAccount})
      .then((result: any) => {
        return resolve(result);
      })
    })
  }

  authorizeToken(toAddress: string, tokenId: number, right: number, currentAccount: string) {
    let that = this;
    return new Promise((resolve, reject) => {
      that.nftContract.methods.transferRight(toAddress, tokenId, right).send({from: currentAccount})
      .then((result: any) => {
        return resolve(result);
      })
    })
  }

  getTokenPrice(tokenId: number) {
    let that = this;
    return new Promise((resolve, reject) => {
      that.nftContract.methods.getTokenPrice(tokenId).call()
      .then((result: any) => {
        return resolve(result);
      })
    })
  }

  setTokenPrice(tokenId: number, price: number, account: string) {
    let that = this;
    return new Promise((resolve, reject) => {
      that.nftContract.methods.setTokenPrice(tokenId, price).send({from: account})
      .then((result: any) => {
        return resolve(result);
      })
    })
  }

  buyToken(tokenId: number, account: string) {
    let that = this;
    return new Promise((resolve, reject) => {
      that.pageContract.methods.buyToken(tokenId).send({from: account})
      .then((result: any) => {
        return resolve(result);
      })
    })
  }

  getTokenBookId(tokenId: number) {
    let that = this;
    return new Promise((resolve, reject) => {
      that.nftContract.methods.getTokenBook(tokenId).call()
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
      that.nftContract.methods.balanceOf(account).call()
      .then(function(result: any) {
        let balance = result;
        let promises: Array<Promise<any>> = []
        for (let i = 0; i < balance; i++) {
          promises.push(that.nftContract.methods.tokenOfOwnerByIndex(account, i).call());
        }
        Promise.all(promises).then(values => {
          let tokensInfo = values.map((id) => {
            let info: TokenInfo = { tokenId: id };
            return info
          });
          let promises: Array<Promise<any>> = []
          for (let item of tokensInfo) {
            promises.push(
              that.nftContract.methods.getTokenBook(item.tokenId).call()
            );
          }
          Promise.all(promises).then(values => {
            for (var i = 0; i < values.length; i++) {
              tokensInfo[i].bookId = values[i];
            }
            let promises: Array<Promise<any>> = [];
            for (let item of tokensInfo) {
              promises.push(
                that.nftContract.methods.getBookTitle(item.bookId).call()
              );
            }
            Promise.all(promises).then(titles => {
              for (var i = 0; i < titles.length; i++) {
                tokensInfo[i].bookTitle = titles[i];
              }
              let promises: Array<Promise<any>> = [];
              for (let item of tokensInfo) {
                promises.push(
                  that.nftContract.methods.getTokenRight(item.tokenId).call()
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
