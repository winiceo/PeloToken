var PELOToken = artifacts.require("./PELOBasicToken.sol");
var PELOMintableToken = artifacts.require("./PELOMintableToken.sol");

module.exports = function(deployer) {
  deployer.deploy(PELOToken, 10000000000000000);
  deployer.deploy(PELOMintableToken, 10000000000000000, 50000000000000000);
};
// 10000000000000000
// 50000000000000000
