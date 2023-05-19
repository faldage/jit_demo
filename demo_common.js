import { apiKey } from "./src/apiKey.js";
import { ethers } from "ethers"
import { calcNextBlockBaseFee, match, stringifyBN } from "./src/utils.js";
import { CONTRACTS } from "./src/constants.js";
import { parseUniv3RouterTx } from "./src/parse.js"

const url = "wss://eth-mainnet.g.alchemy.com/v2/" + apiKey;

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

    // check if is swap
    if (!match(tx.to, CONTRACTS.UNIV3_ROUTER)) {
      return;
    }

    // decode data
    //(tokenIn, tokenOut, fee, recipient, deadline, amountIn, amountOutMinimum, sqrtPriceLimitX96)
    // exactInputSingle only
    const dataDecoded = parseUniv3RouterTx(tx.data);
    if (dataDecoded === null){
      return;
    }
    console.log(tx);
    console.log(dataDecoded);
    
    // cal profit

    // cal amount and tick

    // submit my transaction
  

  });
};

main();
//console.log(abi);