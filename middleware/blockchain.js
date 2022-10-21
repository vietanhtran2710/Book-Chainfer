const Web3 = require('web3')
const artifacts = require('../build/contracts/NFTOwnership.json');
const contractABI = artifacts.abi;
const contractAddress = artifacts.networks["5777"].address
this.web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");

exports.verifyUserToken = async (req, res, next) => {
    console.log(req.params);
    console.log(req.address);
    this.contract = await new this.web3.eth.Contract(contractABI, contractAddress);
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