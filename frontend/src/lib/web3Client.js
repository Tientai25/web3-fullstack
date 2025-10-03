import Web3 from "web3";

export function getWeb3() {
  if (!window.ethereum) throw new Error("MetaMask not found");
  return new Web3(window.ethereum);
}
