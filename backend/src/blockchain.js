import { ethers } from "ethers";
import Web3 from "web3";
import cache from "./cache.js";

const ABI = [
  "function current() view returns (int256)",
  "function increment()",
  "function decrement()",
  "event ValueChanged(address indexed caller, int256 newValue)"
];

export function makeClients({ RPC_URL, CONTRACT_ADDRESS }) {
  if (!RPC_URL || !CONTRACT_ADDRESS) throw new Error("Missing RPC or contract address");

  // ethers provider/contract for reads
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contractEthers = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

  // web3 for event polling (HTTP). For WS, use WebsocketProvider.
  const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));
  const contractWeb3 = new web3.eth.Contract([
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "internalType": "address", "name": "caller", "type": "address"},
        {"indexed": false, "internalType": "int256", "name": "newValue", "type": "int256"}
      ],
      "name": "ValueChanged",
      "type": "event"
    }
  ], CONTRACT_ADDRESS);

  async function readValue() {
    const v = await contractEthers.current();
    cache.value = v.toString();
    return cache.value;
  }

  async function startEventPolling() {
    let latest = await web3.eth.getBlockNumber();
    setInterval(async () => {
      try {
        const currentBlock = await web3.eth.getBlockNumber();
        if (currentBlock > latest) {
          const events = await contractWeb3.getPastEvents("ValueChanged", {
            fromBlock: latest + 1,
            toBlock: currentBlock
          });
          events.reverse().forEach(ev => {
            const newValue = typeof ev.returnValues.newValue === 'bigint' 
              ? ev.returnValues.newValue.toString()
              : String(ev.returnValues.newValue);
            cache.pushEvent({
              tx: ev.transactionHash,
              caller: ev.returnValues.caller,
              newValue: newValue,
              blockNumber: ev.blockNumber
            });
          });
          latest = currentBlock;
        }
      } catch (e) {
        console.error("poll error", e.message);
      }
    }, 3000);
  }

  return { provider, contractEthers, readValue, startEventPolling };
}
