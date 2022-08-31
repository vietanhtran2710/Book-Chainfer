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
      .then(function(result: any) {
        return resolve(result);
      })
    })
  }

}
