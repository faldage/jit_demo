import { url } from "./src/url.js";
import { ethers } from "ethers"
import { calcNextBlockBaseFee, match, stringifyBN, calcTickRange } from "./src/utils.js";
import { CONTRACTS, ABIS } from "./src/constants.js";
import { parseUniv3RouterTx } from "./src/parse.js"
import { createRequire } from "module";
import { FormatTypes, Interface } from "@ethersproject/abi";
const require = createRequire(import.meta.url);

const main = function () {
  console.log("listening...");
  const customWsProvider = new ethers.WebSocketProvider(url);

  customWsProvider.on("pending", async (txHash) => {
    const [tx, txRecp] = await Promise.all([
      customWsProvider.getTransaction(txHash),
      customWsProvider.getTransactionReceipt(txHash),
    ]);

    // Make sure transaction hasn't been mined
    if (txRecp !== null) {
      return;
    }

    // Sometimes tx is null for some reason
    if (tx === null) {
      return;
    }

    // check if is swap ==================================================
    if (!match(tx.to, CONTRACTS.UNIV3_ROUTER)) {
      return;
    }

    // decode data
    //(tokenIn, tokenOut, fee, recipient, deadline, amountIn, amountOutMinimum, sqrtPriceLimitX96)
    // exactInputSingle only
    const dataDecoded = parseUniv3RouterTx(tx.data);
    if (dataDecoded === null) {
      return;
    }

    const { tokenIn, tokenOut, fee, recipient, deadline, amountIn, amountOutMinimum, sqrtPriceLimitX96 } = dataDecoded;
    // fee: 100(0.01%) 500(0.05%) 3000(0.30%) 10000(1%)

    // If tx deadline has passed, just ignore it
    // As we cannot 'sandwich' it
    if (new Date().getTime() / 1000 > deadline) {
      return;
    }
    console.log(tx);
    console.log(dataDecoded);


    // cal amount, tick and profit==================================================
    const factoryContract = new ethers.Contract(CONTRACTS.UNIV3_FACTORY, ABIS.FACTORY, customWsProvider);
    const poolAddress = await factoryContract.getPool(tokenIn, tokenOut, fee);
    const poolContract = new ethers.Contract(poolAddress, ABIS.POOL, customWsProvider);

    const slot0 = poolContract.slot0();
    const tickSpacing = await poolContract.tickSpacing();
    /* recipient (address)
    tickLower (int24)
    tickUpper (int24)
    amount (uint128)
    data (bytes) */
    const recipientMint = recipient;
    const [tickLower, tickUpper] = calcTickRange(slot0[1], tickSpacing);
    const liquidityAmount = amountIn;

    return;

    // cal profit ==================================================
    // cost = gas for mint, collect and burn
    //get pool


    const estimatedGasMint = await customWsProvider.estimateGas(poolAddress, '0x3c8a7d8d', 0);
    const estimatedGasCollect = await customWsProvider.estimateGas(poolAddress, '0x4f1eb3d8', 0);
    const estimatedGasBurn = await customWsProvider.estimateGas(poolAddress, '0xa34123a7', 0);
    console.log(estimatedGasMint);
    console.log(estimatedGasCollect);
    console.log(estimatedGasBurn);
    const gasPrice0 = 1; // varies according to swaper data
    const gasPrice1 = 1; // varies according to swaper data
    const cost = estimatedGas0 * gasPrice0 + estimatedGas1 * gasPrice1;
    // revenue = swaper's fee
    const revenue = amountIn * fee; // to be devided by 10^6 and multi share in liquidity used.
    if (revenue <= cost * 1000000) {
      return;
    }


    // submit my transaction ==================================================


  });
};

main();