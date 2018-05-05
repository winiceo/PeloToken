const GeoToken = artifacts.require('./GeoToken.sol')

module.exports = (deployer) => {
  return deployer.deploy(GeoToken)
}
