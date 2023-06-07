//import { ethers } from "ethers"
import { calcNextBlockBaseFee, match, stringifyBN, calcTickRange } from "../src/utils.js";
import { CONTRACTS, ABIS, UINT128MAX, TOKEN } from "../src/constants.js";
import { parseUniv3RouterTx } from "../src/parse.js"
import { url, url_alchemy } from "../src/url.js";
import JSBI from "jsbi";
import hre from "hardhat";
import { assert } from "chai";
//import { AbiCoder } from "ethers/lib/utils.js";
const ifaceRouter02 = new hre.ethers.utils.Interface(ABIS.ROUTER02);
const abiCoder = new hre.ethers.utils.AbiCoder();

//const customWsProvider = new ethers.WebSocketProvider(url);
const customWsProvider = await new hre.ethers.getDefaultProvider("ws://127.0.0.1:8545/");

const [user1, user2] = await hre.ethers.getSigners();
console.log("user1.address = ", user1.address);
console.log("user2.address = ", user2.address);


describe("Test", function () {
  it("Init", async function () {
    console.log("1");
    const eth1 = await customWsProvider.getBalance(user1.address, "pending");
    console.log("eth is ", eth1);
  });
  it("Mint balance", async function () {
    const balance1_init = await token1.balanceOf(user1.address);
    const balance2_init = await token2.balanceOf(user1.address);
    console.log("balance1_init = ", balance1_init);
    console.log("balance2_init = ", balance2_init);

  });
  it("Wrap ETH", async function () {
    let ETH_balance1 = await customWsProvider.getBalance(user1.address);
    let ETH_balance2 = await customWsProvider.getBalance(user2.address);
    console.log("eth1 is ", ETH_balance1);
    console.log("eth2 is ", ETH_balance2);
    const WETHContract1 = new hre.ethers.Contract(TOKEN.WETH, ABIS.ERC20, user1);
    const WETHContract2 = new hre.ethers.Contract(TOKEN.WETH, ABIS.ERC20, user2);
    //const WETH2 = new hre.ethers.Contract(TOKEN.WETH, ABIS.ERC20, user2);
    let WETH_balance1 = await WETHContract1.balanceOf(user1.address);
    let WETH_balance2 = await WETHContract2.balanceOf(user2.address);
    console.log("weth1 is ", WETH_balance1);
    console.log("weth2 is ", WETH_balance2);

    const tx = await WETHContract1.deposit({value: ethers.utils.parseEther("123")})
    await tx.wait();
    const tx2 = await WETHContract2.deposit({value: ethers.utils.parseEther("456")})
    await tx2.wait();
    ETH_balance1 = await customWsProvider.getBalance(user1.address);
    ETH_balance2 = await customWsProvider.getBalance(user2.address);
    console.log("after transaction, eth1 is ", ETH_balance1);
    console.log("after transaction, eth2 is ", ETH_balance2);
    WETH_balance1 = await WETHContract1.balanceOf(user1.address);
    WETH_balance2 = await WETHContract2.balanceOf(user2.address);
    console.log("after transaction, weth1 is ", WETH_balance1);
    console.log("after transaction, weth2 is ", WETH_balance2);

    const WETH_balance12 = await WETHContract2.balanceOf(user1.address);
    const WETH_balance21 = await WETHContract1.balanceOf(user2.address);
    console.log("xxxxxxxxxxxxx, weth1 is ", WETH_balance12);
    console.log("xxxxxxxxxxxxx, weth2 is ", WETH_balance21);

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
  it("mint liquidity", async function () {
    // estimate
    // mint
/*     let dataFunc = ifa.encodeFunctionData('fee', []);
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

    return; */

  });
});