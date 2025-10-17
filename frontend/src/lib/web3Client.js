// import Web3 from "web3";

// export function getWeb3() {
//   if (!window.ethereum) throw new Error("MetaMask not found");
//   return new Web3(window.ethereum);
// }

import Web3 from "web3";

const FALLBACK_RPC = "http://127.0.0.1:8545";

export function getWeb3({ allowFallback = true } = {}) {
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      return new Web3(window.ethereum);
    } catch (err) {
      console.warn("web3: injected provider init failed:", err);
    }
  }

  if (allowFallback) {
    return new Web3(new Web3.providers.HttpProvider(FALLBACK_RPC));
  }

  throw new Error("MetaMask not found");
}