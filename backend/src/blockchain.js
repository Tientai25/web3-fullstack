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
    let latest;
    
    // Lấy block hiện tại và query events cũ
    try {
      const currentBlock = Number(await web3.eth.getBlockNumber()); // Convert BigInt to number
      // Bắt đầu từ 500 blocks trước (hoặc từ block 0 nếu chain mới hơn 500 blocks)
      // Điều này đảm bảo lấy được các events cũ khi backend khởi động
      latest = Math.max(currentBlock - 500, 0);
      
      // Query các events cũ ngay khi khởi động
      // Chia nhỏ query để tránh lỗi "query returned more than 10000 results"
      const MAX_BLOCK_RANGE = 2000;
      let fromBlock = latest;
      let totalEvents = 0;
      
      try {
        while (fromBlock <= currentBlock) {
          const toBlock = Math.min(fromBlock + MAX_BLOCK_RANGE - 1, currentBlock);
          
          try {
            const initialEvents = await contractWeb3.getPastEvents("ValueChanged", {
              fromBlock: fromBlock,
              toBlock: toBlock
            });
            
            initialEvents.reverse().forEach(ev => {
              try {
                const newValue = typeof ev.returnValues.newValue === 'bigint' 
                  ? ev.returnValues.newValue.toString()
                  : String(ev.returnValues.newValue || '');
                cache.pushEvent({
                  tx: String(ev.transactionHash || ''),
                  caller: String(ev.returnValues.caller || ''),
                  newValue: newValue,
                  blockNumber: typeof ev.blockNumber === 'bigint' 
                    ? ev.blockNumber.toString() 
                    : String(ev.blockNumber || '')
                });
              } catch (e) {
                console.error("Error processing event:", e);
              }
            });
            
            totalEvents += initialEvents.length;
          } catch (e) {
            console.error(`Error loading events from block ${fromBlock} to ${toBlock}:`, e.message);
            // Tiếp tục với batch tiếp theo thay vì dừng hẳn
          }
          
          fromBlock = toBlock + 1;
        }
        
        console.log(`Loaded ${totalEvents} initial events from blocks ${latest} to ${currentBlock}`);
      } catch (e) {
        console.error("Error loading initial events:", e.message);
      }
      
      // Cập nhật latest để chỉ poll events mới từ bây giờ
      latest = currentBlock;
    } catch (e) {
      console.error("Error initializing event polling:", e.message);
      // Nếu không lấy được block number, bắt đầu từ 0
      latest = 0;
    }
    
    // Bắt đầu polling các events mới
    // Sử dụng closure để giữ reference đến latest
    setInterval(async () => {
      try {
        const currentBlock = Number(await web3.eth.getBlockNumber()); // Convert BigInt to number
        if (currentBlock >= latest) {
          // Query từ latest + 1 đến currentBlock (inclusive)
          const fromBlock = Number(latest) + 1;
          const toBlock = Number(currentBlock);
          
          if (fromBlock <= toBlock) {
            const events = await contractWeb3.getPastEvents("ValueChanged", {
              fromBlock: fromBlock,
              toBlock: toBlock
            });
            
            if (events.length > 0) {
              console.log(`Found ${events.length} new event(s) in blocks ${fromBlock}-${toBlock}`);
            }
            
            events.reverse().forEach(ev => {
              try {
                const newValue = typeof ev.returnValues.newValue === 'bigint' 
                  ? ev.returnValues.newValue.toString()
                  : String(ev.returnValues.newValue || '');
                cache.pushEvent({
                  tx: String(ev.transactionHash || ''),
                  caller: String(ev.returnValues.caller || ''),
                  newValue: newValue,
                  blockNumber: typeof ev.blockNumber === 'bigint' 
                    ? ev.blockNumber.toString() 
                    : String(ev.blockNumber || '')
                });
                console.log(`Added event: tx=${ev.transactionHash.slice(0,10)}... newValue=${newValue}`);
              } catch (e) {
                console.error("Error processing event:", e);
              }
            });
          }
          
          // Cập nhật latest sau khi query xong
          latest = currentBlock;
        }
      } catch (e) {
        console.error("poll error", e.message);
        console.error("poll error stack", e.stack);
      }
    }, 3000);
  }

  return { provider, contractEthers, readValue, startEventPolling };
}
