import { BrowserProvider, JsonRpcProvider, Contract, formatEther } from "ethers";

// ✅ RPC dự phòng (ví dụ: local Hardhat hoặc Ganache)
const FALLBACK_RPC = "http://127.0.0.1:8545";

/**
 * Lấy provider — ưu tiên MetaMask, fallback sang RPC nếu cần
 */
export async function getProvider({ allowFallback = true } = {}) {
  // Nếu chạy trên trình duyệt và có MetaMask
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      return new BrowserProvider(window.ethereum, "any");
    } catch (err) {
      console.warn("ethers: BrowserProvider init failed:", err);
    }
  }

  // Nếu cho phép fallback sang RPC
  if (allowFallback) {
    console.warn("⚠️ Không phát hiện MetaMask — dùng RPC fallback:", FALLBACK_RPC);
    return new JsonRpcProvider(FALLBACK_RPC);
  }

  throw new Error("MetaMask not found. Vui lòng cài đặt MetaMask để kết nối ví.");
}

/**
 * Lấy signer từ MetaMask
 */
export async function getSigner({ allowFallback = false } = {}) {
  const provider = await getProvider({ allowFallback });

  // Nếu không có window.ethereum (tức là không có MetaMask)
  if (!(typeof window !== "undefined" && window.ethereum)) {
    throw new Error("MetaMask not found. Vui lòng cài đặt hoặc bật MetaMask.");
  }

  try {
    // Yêu cầu quyền truy cập tài khoản
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const signer = await provider.getSigner();

    // Patch getFeeData cho mạng không hỗ trợ EIP-1559
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
            lastBaseFeePerGas: gasPrice,
          };
        }
        throw error;
      }
    };

    return signer;
  } catch (err) {
    console.error("ethers: getSigner failed:", err);
    throw new Error("Failed to get signer: " + err.message);
  }
}

/**
 * Lấy số dư (balance) của địa chỉ
 */
export async function getBalance(address) {
  const provider = await getProvider();
  const bal = await provider.getBalance(address);
  return formatEther(bal);
}

/**
 * Tạo instance contract
 */
export function makeContract(address, abi, signerOrProvider) {
  return new Contract(address, abi, signerOrProvider);
}
