const AurexiaSocialToken = artifacts.require("AurexiaSocialToken");

module.exports = function(deployer) {
  deployer.deploy(AurexiaSocialToken);
};