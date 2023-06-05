import { createRequire } from "module";
const require = createRequire(import.meta.url);
import JSBI from "jsbi";

export const CONTRACTS = {
    UNIV3_ROUTER: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    UNIV3_FACTORY: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
  
    // Sandwich contract
    JIT: process.env.JIT_CONTRACT,
  };

export const ABIS = {
  ROUTER: require("./routerABI.json"),
  FACTORY: require("./factoryABI.json"),
  POOL: require("./poolABI.json")
}

export const UINT128MAX = 2n ** 128n - 1n;