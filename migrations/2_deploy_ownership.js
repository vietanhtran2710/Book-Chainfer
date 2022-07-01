var Ownership = artifacts.require("./NFTOwnership.sol");

module.exports = function(deployer) {
  deployer.deploy(Ownership);
};