/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle");
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      chainId: 1,
      mining: {
        auto: false,
        interval: 3000,
      },
      forking: {
        url: ""
      }
    },
  },
};
