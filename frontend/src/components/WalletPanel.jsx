import React from "react";
import { useWallet } from "../hooks/useWallet.js";

export default function WalletPanel() {
  const { account, chainId, balance, ens, connect } = useWallet();

  const short = (a) => (a ? `${a.slice(0,6)}…${a.slice(-4)}` : '')

  return (
    <div className="bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Wallet</h3>
          <p className="text-sm text-slate-500 mt-1">Connect your MetaMask wallet to interact with contracts.</p>
        </div>
      </div>

      <div className="mt-4">
        {account ? (
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center font-mono shrink-0">{short(account).slice(0,2)}</div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{ens ? `${ens} (${short(account)})` : short(account)}</div>
                <div className="text-xs text-slate-400">{chainId ? `Chain ${chainId}` : ''}</div>
              </div>
            </div>

            <div className="mt-2 text-sm text-slate-600">Balance: <span className="font-medium">{balance ?? '—'} ETH</span></div>
          </div>
        ) : (
          <div>
            <button onClick={connect} className="w-full sm:w-auto mt-3 inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">
              Connect MetaMask
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
