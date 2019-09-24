const HDWalletProvider = require("truffle-hdwallet-provider");
const memonic = "enhance prefer gospel staff reward youth forward curve before predict crouch bottom"
module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(memonic, "https://ropsten.infura.io/v3/cc89e42528e441afb25d84e1499632ba")
      },
      network_id: 3
    }
  }
};