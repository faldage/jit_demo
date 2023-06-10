//import { ethers } from "ethers"
import { calcNextBlockBaseFee, match, stringifyBN, calcTickRange } from "../src/utils.js";
import { CONTRACTS, ABIS, UINT128MAX, TOKEN } from "../src/constants.js";
import { parseUniv3RouterTx } from "../src/parse.js"
import JSBI from "jsbi";
import hre from "hardhat";
import { assert } from "chai";
//import { AbiCoder } from "ethers/lib/utils.js";
const ifaceRouter02 = new hre.ethers.utils.Interface(ABIS.ROUTER02);
const abiCoder = new hre.ethers.utils.AbiCoder();

//const customWsProvider = new ethers.WebSocketProvider(url);
// const customWsProvider = await new hre.ethers.getDefaultProvider("ws://127.0.0.1:8545/");
const customWsProvider = hre.ethers.provider;

const [user1, user2] = await hre.ethers.getSigners();
console.log("user1.address = ", user1.address);
console.log("user2.address = ", user2.address);

const WETHContract1 = new hre.ethers.Contract(TOKEN.WETH, ABIS.WETH, user1);
const WETHContract2 = new hre.ethers.Contract(TOKEN.WETH, ABIS.WETH, user2);
const DAIContract1 = new hre.ethers.Contract(TOKEN.DAI, ABIS.ERC20, user1);
const DAIContract2 = new hre.ethers.Contract(TOKEN.DAI, ABIS.ERC20, user2);

async function readBalance(token) {
  let balance1 = 0;
  let balance2 = 0;
  switch (token) {
    case "ETH":
      balance1 = await customWsProvider.getBalance(user1.address);
      balance2 = await customWsProvider.getBalance(user2.address);
      break;
    case "WETH":
      balance1 = await WETHContract1.balanceOf(user1.address);
      balance2 = await WETHContract2.balanceOf(user2.address);
      break;
    case "DAI":
      balance1 = await DAIContract1.balanceOf(user1.address);
      balance2 = await DAIContract2.balanceOf(user2.address);
      break;
    default:
      console.log("Token name is wrong!");
      return;
  }
  console.log("[", token, "]:", "user1 = ", balance1);
  console.log("[", token, "]:", "user2 = ", balance2);
}

describe("Test", function () {
  it("Init", async function () {
    console.log(1);
  });
  it("Wrap ETH", async function () {
    await readBalance("ETH");
    await readBalance("WETH");
    //await readBalance("DAI");

    const tx = await WETHContract1.deposit({ value: ethers.utils.parseEther("123") });
    
    
    let blockData = await customWsProvider.send("eth_getBlockByNumber", ["pending",false]);
    let transactionData1 = await customWsProvider.getTransaction(blockData.transactions[0]);
    console.log("block data============================");
    console.log(blockData);
    console.log("pending transaction1==================");
    console.log(transactionData1);

    const tx2 = await WETHContract2.deposit({ value: ethers.utils.parseEther("456"), gasPrice: transactionData1.gasPrice.add(1n) });

    blockData = await customWsProvider.send("eth_getBlockByNumber", ["pending",false]);
    transactionData1 = await customWsProvider.getTransaction(blockData.transactions[0]);
    let transactionData2 = await customWsProvider.getTransaction(blockData.transactions[1]);
    console.log("block data============================");
    console.log(blockData);
    console.log("pending transaction1==================");
    console.log(transactionData1);
    console.log("pending transaction2==================");
    console.log(transactionData2);

    await tx.wait();
    await tx2.wait();

    await readBalance("ETH");
    await readBalance("WETH");
    //await readBalance("DAI");

    /*     const router02Contract = new hre.ethers.Contract(CONTRACTS.UNIV3_ROUTER02, ABIS.ROUTER02, user1);
    const dataFunc = ifaceRouter02.encodeFunctionData('wrapETH', [10]);
    const estimateGas = await user1.estimateGas({
      to: CONTRACTS.UNIV3_ROUTER02, data: dataFunc, value: hre.ethers.utils.parseEther("10.0")
    })
    console.log("estimateGas = ", estimateGas); 

    const res = await user1.sendTransaction({
      from: user1.address, to: CONTRACTS.UNIV3_ROUTER02, 
      data: dataFunc, value: hre.ethers.utils.parseEther("10.0"),
      gasLimit: estimateGas
    });
    console.log(res); */
  });
  /*it("mint liquidity", async function () {
    // estimate
    // mint
         let dataFunc = ifa.encodeFunctionData('fee', []);
        const estimatedGasFee = await await customWsProvider.estimateGas({
          to: poolAddress, data: dataFunc, value: hre.ethers.utils.parseEther("0")
        });
        console.log(estimatedGasFee._hex);
    
        let data = abiCoder.encode(
          ['address', 'int24', 'int24', 'uint128'],
          [recipientMint, tickLower, tickUpper, liquidityAmount]
        );
        dataFunc = ifa.encodeFunctionData('mint', [recipientMint, tickLower, tickUpper, liquidityAmount, data]);
         const estimatedGasMint = await customWsProvider.estimateGas({
          to: poolAddress, data: dataFunc, value: hre.ethers.utils.parseEther("0")
        });
        console.log(estimatedGasMint._hex); 
        // collect
        dataFunc = ifa.encodeFunctionData('collect', [recipientMint, tickLower, tickUpper, UINT128MAX, UINT128MAX]);
        const estimatedGasCollect = await await customWsProvider.estimateGas({
          to: poolAddress, data: dataFunc, value: hre.ethers.utils.parseEther("0")
        });
        console.log(estimatedGasCollect._hex); 
        // burn
         dataFunc = ifa.encodeFunctionData('burn', [tickLower, tickUpper, UINT128MAX]);
         const estimatedGasBurn = await await customWsProvider.estimateGas({
           to: poolAddress, data: dataFunc, value: hre.ethers.utils.parseEther("0")
         });
         console.log(estimatedGasBurn._hex);
    
        return; 

  });*/
});
