import React, { useContext } from 'react'
import { useWallet } from '../hooks/useWallet.js'
import { DarkModeContext } from '../contexts/DarkModeContext.jsx'

export default function Header() {
  const { account, chainId, balance, connect } = useWallet()
  const { dark, setDark } = useContext(DarkModeContext)

  const short = (addr) => addr ? `${addr.slice(0,6)}…${addr.slice(-4)}` : null

  return (
    <header className="w-full py-5">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold">W3</div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Web3 Fullstack</h1>
            <div className="text-xs text-slate-400 dark:text-slate-300">MetaMask · ethers.js · web3.js</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setDark(!dark)} className="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">{dark ? 'Light' : 'Dark'}</button>
          {account ? (
            <div className="flex items-center gap-3">
              <div className="text-sm bg-slate-800 text-white px-3 py-1 rounded-md">{short(account)}</div>
              <div className="text-sm text-slate-500 dark:text-slate-300">{chainId ? `Chain ${chainId}` : ''}</div>
              <div className="text-sm text-slate-500 dark:text-slate-300">{balance ? `${balance} ETH` : ''}</div>
            </div>
          ) : (
            <button onClick={connect} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">Connect Wallet</button>
          )}
        </div>
      </div>
    </header>
  )
}
