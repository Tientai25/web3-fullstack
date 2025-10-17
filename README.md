# Web3 Fullstack Demo (MetaMask + ethers.js + web3.js)

## Structure
- `contracts/` — Hardhat (JS) with `Counter.sol`
- `backend/` — Express API (ethers for reads, web3 for event polling)
- `frontend/` — Vite + React

## Quick Start (Localhost)

### 1) Contracts
```bash
cd contracts
npm i
npm run node   # keep this terminal open
# in another terminal:
npm run compile
npm run deploy:local
```
Copy the printed contract address.

### 2) Backend
```bash
cd ../backend
cp .env.example .env
# edit .env -> CONTRACT_ADDRESS=<address from deploy>
npm i
npm run dev
```
Check: http://localhost:4000/api/health

### 3) Frontend
```bash
cd ../frontend
cp .env.example .env
# edit .env -> VITE_COUNTER_ADDRESS=<address from deploy>
npm i
npm run dev
```
Open http://localhost:5173

### MetaMask
Add Localhost 8545 (ChainId 31337). Import one private key from Hardhat node output.

## Testnet (Sepolia)
- Fill `contracts/.env` from `.env.example`
- `npm run deploy:sepolia` in `contracts`
- Update backend & frontend `.env` with new address; switch MetaMask to Sepolia.
