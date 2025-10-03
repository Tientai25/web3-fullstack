import React from "react";
import { useWallet } from "../hooks/useWallet.js";

export default function WalletPanel() {
  const { account, chainId, balance, connect } = useWallet();
  return (
    <div style={{border:"1px solid #ddd", padding:12, borderRadius:8}}>
      <h3>Wallet</h3>
      {account ? (
        <>
          <div><b>Account:</b> {account}</div>
          <div><b>ChainId:</b> {chainId}</div>
          <div><b>Balance:</b> {balance} ETH</div>
        </>
      ) : (
        <button onClick={connect}>Connect MetaMask</button>
      )}
    </div>
  );
}
