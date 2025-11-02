// import Web3 from "web3";

// export function getWeb3() {
//   if (!window.ethereum) throw new Error("MetaMask not found");
//   return new Web3(window.ethereum);
// }

import Web3 from "web3";

const FALLBACK_RPC = "http://127.0.0.1:8545";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function retry(fn, retries = MAX_RETRIES, delay = RETRY_DELAY) {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && (
      error.message.includes('circuit breaker') ||
      error.message.includes('eth_maxPriorityFeePerGas')
    )) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retry(fn, retries - 1, delay);
    }
    throw error;
  }
}

export function getWeb3({ allowFallback = true } = {}) {
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      const web3 = new Web3(window.ethereum);
      
      // Wrap provider send method with retry logic
      const originalSend = web3.currentProvider.send.bind(web3.currentProvider);
      web3.currentProvider.send = async (payload, callback) => {
        try {
          await retry(async () => {
            return new Promise((resolve, reject) => {
              originalSend(payload, (error, result) => {
                if (error) reject(error);
                else resolve(result);
              });
            });
          });
        } catch (error) {
          console.warn("Provider send failed:", error);
          if (allowFallback) {
            const fallbackWeb3 = new Web3(new Web3.providers.HttpProvider(FALLBACK_RPC));
            return fallbackWeb3.currentProvider.send(payload, callback);
          }
          throw error;
        }
      };

      return web3;
    } catch (err) {
      console.warn("web3: injected provider init failed:", err);
    }
  }

  if (allowFallback) {
    return new Web3(new Web3.providers.HttpProvider(FALLBACK_RPC));
  }

  throw new Error("MetaMask not found");
}