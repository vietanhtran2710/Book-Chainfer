var Ownership = artifacts.require("./NFTOwnership.sol");
var PageToken = artifacts.require("./PageToken.sol");

module.exports = function(deployer) {
  deployer.deploy(Ownership).
  then(() => {
    return deployer.deploy(PageToken, Ownership.address);
  })
  .then(async () => {
    let ownershipContractInstance = await Ownership.deployed();
    let pageTokenContractInstance = await PageToken.deployed();
    ownershipContractInstance.setContract(pageTokenContractInstance.address);
  })
};