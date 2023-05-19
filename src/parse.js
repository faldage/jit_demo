import { createRequire } from "module";
const require = createRequire(import.meta.url);

import abiDecoder from "abi-decoder";
const IUniswapV3RouterABI = require("./abi.json");

// Easily decode UniswapV3 Router data
abiDecoder.addABI(IUniswapV3RouterABI);

// only: multicall =>  exactInputSingle
export const parseUniv3RouterTx = (txData) => {
  let data = null;
  /*
  try {
    data = abiDecoder.decodeMethod(txData);
  } catch (e) {
    return null;
  }
  if (data.name !== "multicall") {
    return null;
  }*/

  try {
    data = abiDecoder.decodeMethod(txData);
  } catch (e) {
    return null;
  }
  //if (data.name == "multicall") {
  //  return "multicall";
  //}
  if (data.name !== "exactInputSingle") {
    return null;
  }
  const res_struct = data.params[0].value;
  return {
    tokenIn: res_struct.tokenIn,
    tokenOut: res_struct.tokenOut,
    fee: res_struct.fee,
    recipient: res_struct.recipient,
    deadline: res_struct.deadline,
    amountIn: res_struct.amountIn,
    amountOutMinimum: res_struct.amountOutMinimum,
    sqrtPriceLimitX96: res_struct.sqrtPriceLimitX96
  }
};
