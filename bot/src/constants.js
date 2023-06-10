import { createRequire } from "module";
const require = createRequire(import.meta.url);
import JSBI from "jsbi";

export const CONTRACTS = {
  UNIV3_ROUTER: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
  UNIV3_ROUTER02: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
  UNIV3_FACTORY: "0x1F98431c8aD98523631AE4a59f267346ea31F984",

  // Sandwich contract
  JIT: process.env.JIT_CONTRACT,
};

export const ABIS = {
  ROUTER: require("./routerABI.json"),
  ROUTER02: require("./router02ABI.json"),
  FACTORY: require("./factoryABI.json"),
  POOL: require("./poolABI.json"),
  ERC20: require("./erc20.json"),
  WETH: require("./wethABI.json")
}

export const UINT128MAX = 2n ** 128n - 1n;
export const TOKEN = {
  WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F"
}