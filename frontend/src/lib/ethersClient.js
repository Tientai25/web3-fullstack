import { BrowserProvider, Contract, formatEther } from "ethers";

export async function getProvider() {
  if (!window.ethereum) throw new Error("MetaMask not found");
  const provider = new BrowserProvider(window.ethereum);
  return provider;
}

export async function getSigner() {
  const provider = await getProvider();
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
}

export async function getBalance(address) {
  const provider = await getProvider();
  const bal = await provider.getBalance(address);
  return formatEther(bal);
}

export function makeContract(address, abi, signerOrProvider) {
  return new Contract(address, abi, signerOrProvider);
}
