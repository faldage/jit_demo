/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-ethers");
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
        url: "",
        blockNumber: 17119904
      },
      allowUnlimitedContractSize: true
    },
  },
};
