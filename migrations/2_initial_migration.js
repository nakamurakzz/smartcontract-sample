const GreeterContract = artifacts.require('GreeterContract');

module.exports = function (deployer) {
  deployer.deploy(GreeterContract);
}