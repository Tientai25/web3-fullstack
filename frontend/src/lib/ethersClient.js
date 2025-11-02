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
  if (!window.ethereum) throw new Error("MetaMask not found");
  
  try {
    // Use ethers v6 BrowserProvider
    const provider = new BrowserProvider(window.ethereum, "any");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const signer = await provider.getSigner();
    
    // Override getFeeData to handle networks without EIP-1559
    const originalGetFeeData = provider.getFeeData.bind(provider);
    provider.getFeeData = async () => {
      try {
        return await originalGetFeeData();
      } catch (error) {
        if (error.message.includes("eth_maxPriorityFeePerGas")) {
          const gasPrice = await provider.getGasPrice();
          return {
            gasPrice,
            maxFeePerGas: gasPrice,
            maxPriorityFeePerGas: gasPrice,
            lastBaseFeePerGas: gasPrice
          };
        }
        throw error;
      }
    };
    
    return signer;
  } catch (err) {
    console.warn("ethers: getSigner failed:", err);
    throw new Error("Failed to get signer: " + err.message);
  }
}

export async function getBalance(address) {
  const provider = await getProvider();
  const bal = await provider.getBalance(address);
  return formatEther(bal);
}

export function makeContract(address, abi, signerOrProvider) {
  return new Contract(address, abi, signerOrProvider);
}