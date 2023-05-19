import { apiKey } from "./apiKey.js";
import { ethers } from "ethers"
import { calcNextBlockBaseFee, match, stringifyBN } from "./utils.js";
import { CONTRACTS } from "./constants.js";
import abi from "./abi.json"  assert { type: 'json'};

const url = "wss://eth-mainnet.g.alchemy.com/v2/" + apiKey;

const main = function () {
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

    console.log(tx);
    // decode data
    const iface = new ethers.utils.Interface([
      "function exactInputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint deadline, uint amountIn, uint amountOutMinimum, uint160 sqrtPriceLimitX96) calldata) external payable returns (uint amountOut)",
    ]);
    if (tx.data.indexOf(iface.getSighash("exactInputSingle")) !== -1) {
      console.log(`\n[${(new Date).toLocaleTimeString()}] 监听Pending交易: ${txHash} \r`);
      // 打印解码的交易详情
      let parsedTx = iface.parseTransaction(tx)
      console.log("pending交易详情解码：")
      console.log(parsedTx);
      // Input data解码
      console.log("Input Data解码：")
      console.log(parsedTx.args);
    }
    // cal profit

    // cal amount and tick

    // submit my transaction
  

  });
};

main();
//console.log(abi);