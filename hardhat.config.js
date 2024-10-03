require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    holesky: {
      url: process.env.API_URL,
      accounts:[process.env.ACC1_KEY, process.env.ACC2_KEY]
    }
  }
};
