const Web3 = require('web3')
const key = require('../config/secret-key.json');
const nftArtifacts = require('../build/contracts/NFTOwnership.json');
const nftContractABI = nftArtifacts.abi;
const nftContractAddress = nftArtifacts.networks["5777"].address

const pageArtifacts = require('../build/contracts/PageToken.json');
const pageContractABI = pageArtifacts.abi;
const pageContractAddress = pageArtifacts.networks["5777"].address

this.web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");

exports.verifyUserToken = async (req, res, next) => {
    console.log(req.params);
    console.log(req.address);
    this.contract = await new this.web3.eth.Contract(nftContractABI, nftContractAddress);
    let account = req.address;
    let bookId = req.params.id
    let that = this;
    return new Promise((resolve, reject) => {
      that.contract.methods.balanceOf(account).call()
      .then(function(balance) {
        let promises = []
        for (let i = 0; i < balance; i++) {
          promises.push(that.contract.methods.tokenOfOwnerByIndex(account, i).call());
        }
        Promise.all(promises).then(tokenIds => {
            console.log('User tokens: ', tokenIds);
            let promises = []
            for (let item of tokenIds) {
                promises.push(
                    that.contract.methods.getTokenBook(item).call()
                );
            }
          Promise.all(promises).then(bookIds => {
            console.log('User book ID: ', bookIds);
            let found = false;
            for (let item of bookIds) {
              if (bookId == item) {
                found = true; break;
              } 
            }
            if (!found) {
                console.log('User not authorized');
                res.status(401).send('User not authorized');
            }
            else {
                console.log(`User ${account} authorized with bookId ${bookId}`)
                next();
            }
          })
        });
      })
    })
}

exports.transfer = async (to, amount) => {
  const that = this;
  this.pageContract = await new this.web3.eth.Contract(pageContractABI, pageContractAddress);
  const query = this.pageContract.methods.transfer(to, amount);
  const encodedABI = query.encodeABI();
  const signedTx = await this.web3.eth.accounts.signTransaction(
    {
      data: encodedABI,
      from: this.adminAddress,
      gas: 2000000,
      to: this.pageContract.options.address,
    },
    key.secret,
    false,
  );
  return new Promise((resolve, reject) => {
    this.web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    .then(result => {
      return resolve(result);
    })
    .catch(err => {
      return reject(err);
    })
  })
}