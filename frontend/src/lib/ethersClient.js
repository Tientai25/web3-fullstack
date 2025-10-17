// import { BrowserProvider, Contract, formatEther } from "ethers";

// export async function getProvider() {
//   if (!window.ethereum) throw new Error("MetaMask not found");
//   const provider = new BrowserProvider(window.ethereum);
//   return provider;
// }

// export async function getSigner() {
//   const provider = await getProvider();
//   await provider.send("eth_requestAccounts", []);
//   return provider.getSigner();
// }

// export async function getBalance(address) {
//   const provider = await getProvider();
//   const bal = await provider.getBalance(address);
//   return formatEther(bal);
// }

// export function makeContract(address, abi, signerOrProvider) {
//   return new Contract(address, abi, signerOrProvider);
// } 

import { BrowserProvider, JsonRpcProvider, Contract, formatEther } from "ethers";

const FALLBACK_RPC = "http://127.0.0.1:8545";

export async function getProvider({ allowFallback = true } = {}) {
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      return new BrowserProvider(window.ethereum);
    } catch (err) {
      console.warn("ethers: BrowserProvider init failed:", err);
    }
  }

  if (allowFallback) {
    return new JsonRpcProvider(FALLBACK_RPC);
  }

  throw new Error("MetaMask not found");
}

export async function getSigner() {
  const provider = await getProvider();
  // BrowserProvider supports eth_requestAccounts; JsonRpcProvider does not expose a user signer
  if (provider instanceof BrowserProvider) {
    try {
      await provider.send("eth_requestAccounts", []);
      return provider.getSigner();
    } catch (err) {
      console.warn("ethers: eth_requestAccounts failed or was rejected:", err);
      throw new Error("User denied account access or request failed");
    }
  }

  throw new Error("No signer available (using JSON-RPC fallback)");
}

export async function getBalance(address) {
  const provider = await getProvider();
  const bal = await provider.getBalance(address);
  return formatEther(bal);
}

export function makeContract(address, abi, signerOrProvider) {
  return new Contract(address, abi, signerOrProvider);
}