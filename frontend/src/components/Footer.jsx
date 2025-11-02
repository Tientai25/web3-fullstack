import React from 'react'

export default function Footer() {
  const addr = import.meta.env.VITE_COUNTER_ADDRESS || ''
  return (
    <footer className="mt-10 py-8">
      <div className="w-full max-w-[90rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-slate-500">
          <div>
            <div className="font-medium text-slate-700 dark:text-slate-200">Web3 Fullstack Demo</div>
            <div className="mt-1">Built with MetaMask • ethers.js • web3.js</div>
          </div>

          <div className="min-w-0 text-left sm:text-right">
            <div className="truncate">Contract: <span className="font-mono">{addr}</span></div>
            <div className="text-xs text-slate-400">For demo: use Localhost 8545 (Hardhat)</div>
          </div>
        </div>
      </div>
    </footer>
  )
}