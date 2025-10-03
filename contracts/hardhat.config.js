require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const { SEPOLIA_RPC, PRIVATE_KEY, ETHERSCAN_KEY } = process.env;

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    ...(SEPOLIA_RPC && PRIVATE_KEY ? {
      sepolia: {
        url: SEPOLIA_RPC,
        accounts: [PRIVATE_KEY]
      }
    } : {})
  },
  etherscan: {
    apiKey: ETHERSCAN_KEY || ""
  }
};
