require('@nomicfoundation/hardhat-toolbox')
require('dotenv').config()

module.exports = {
  solidity: '0.8.17',
  paths: {
    artifacts: './app/src/artifacts'
  },
  networks: {
    sepolia: {
      url: process.env.TESTNET_SEPOLIA_ALCHEMY_URL,
      accounts: [process.env.PRIVATE_KEY as string]
    }
  }
}
