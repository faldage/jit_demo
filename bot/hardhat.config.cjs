/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      chainId: 1,
      mining: {
        auto: false,
        interval: 30000,
      },
      forking: {
        url: ""
      }
    },
  },
};
