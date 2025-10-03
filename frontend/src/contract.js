export const COUNTER_ADDRESS = import.meta.env.VITE_COUNTER_ADDRESS;
export const COUNTER_ABI = [
  { "inputs": [], "name": "current", "outputs": [{"internalType":"int256","name":"","type":"int256"}], "stateMutability":"view", "type":"function" },
  { "inputs": [], "name": "increment", "outputs": [], "stateMutability":"nonpayable", "type":"function" },
  { "inputs": [], "name": "decrement", "outputs": [], "stateMutability":"nonpayable", "type":"function" },
  { "anonymous": false, "inputs": [
    {"indexed": true, "internalType": "address", "name": "caller", "type": "address"},
    {"indexed": false, "internalType": "int256", "name": "newValue", "type": "int256"}
  ], "name": "ValueChanged", "type": "event" }
];
