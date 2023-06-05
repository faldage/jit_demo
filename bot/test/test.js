//import { ethers } from "ethers"
import { calcNextBlockBaseFee, match, stringifyBN, calcTickRange } from "../src/utils.js";
import { CONTRACTS, ABIS, UINT128MAX } from "../src/constants.js";
import { parseUniv3RouterTx } from "../src/parse.js"
import { url, url_alchemy } from "../src/url.js";
import JSBI from "jsbi";
/* import { createRequire } from "module";
const require = createRequire(import.meta.url); */
//const { ethers } = require("hardhat"); 
//import "@nomicfoundation/hardhat-ethers";
import hre from "hardhat";
//import { AbiCoder } from "ethers/lib/utils.js";
const ifa = new hre.ethers.utils.Interface(ABIS.POOL);
const abiCoder = new hre.ethers.utils.AbiCoder();

//const customWsProvider = new ethers.WebSocketProvider(url);
const customWsProvider = await new hre.ethers.getDefaultProvider(url);

const txHash = '0x7163e60493eb140bdf48b600f467fa0482d8860605f31f24217d484526a65179';
const [tx, txRecp] = await Promise.all([
  customWsProvider.getTransaction(txHash),
  customWsProvider.getTransactionReceipt(txHash),
]);
const dataDecoded = parseUniv3RouterTx(tx.data);

const { tokenIn, tokenOut, fee, recipient, deadline, amountIn, amountOutMinimum, sqrtPriceLimitX96 } = dataDecoded;
const factoryContract = new ethers.Contract(CONTRACTS.UNIV3_FACTORY, ABIS.FACTORY, customWsProvider);
const poolAddress = await factoryContract.getPool(tokenIn, tokenOut, fee);
const poolContract = new ethers.Contract(poolAddress, ABIS.POOL, customWsProvider);
const slot0 = await poolContract.slot0();
console.log(poolAddress);

const tickSpacing = await poolContract.tickSpacing();

const recipientMint = recipient;
const tickLower = calcTickRange(slot0[1], tickSpacing);
const tickUpper = tickLower + tickSpacing;
const liquidityAmount = amountIn ;

describe("Test", function () {
  it("mint liquidity", async function () {
    /* const provider = ethers.provider;
    // 构造 usdt 合约对象
    const USDT = new ethers.Contract(USDT_ADDRESS, USDT_ABI, provider);
    // 调用 usdt 的 totalSupply
    let totalSupply = await USDT.totalSupply();
    console.log(totalSupply.toString()); */

    console.log(recipientMint);
    console.log(tickLower);
    console.log(tickUpper);
    console.log(liquidityAmount);

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
    /* const estimatedGasMint = await customWsProvider.estimateGas({
      to: poolAddress, data: dataFunc, value: hre.ethers.utils.parseEther("0")
    });
    console.log(estimatedGasMint._hex); */
    // collect
    dataFunc = ifa.encodeFunctionData('collect', [recipientMint, tickLower, tickUpper, UINT128MAX, UINT128MAX]);
    const estimatedGasCollect = await await customWsProvider.estimateGas({
      to: poolAddress, data: dataFunc, value: hre.ethers.utils.parseEther("0")
    });
    console.log(estimatedGasCollect._hex);
    // burn
   /*  dataFunc = ifa.encodeFunctionData('burn', [tickLower, tickUpper, UINT128MAX]);
    const estimatedGasBurn = await await customWsProvider.estimateGas({
      to: poolAddress, data: dataFunc, value: hre.ethers.utils.parseEther("0")
    });
    console.log(estimatedGasBurn._hex);
 */
    return;

  });
});