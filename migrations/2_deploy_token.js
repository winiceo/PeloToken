const AirDropContract = artifacts.require('./AirDropContract.sol')

module.exports = (deployer) => {
  return deployer.deploy(AirDropContract)
}
