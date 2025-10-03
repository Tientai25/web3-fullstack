import React from "react";
import WalletPanel from "./components/WalletPanel.jsx";
import CounterPanel from "./components/CounterPanel.jsx";

export default function App() {
  return (
    <div style={{maxWidth:720, margin:"40px auto", fontFamily:"sans-serif"}}>
      <h2>Web3 Fullstack Demo – MetaMask + ethers.js + web3.js</h2>
      <WalletPanel />
      <CounterPanel />
    </div>
  );
}
