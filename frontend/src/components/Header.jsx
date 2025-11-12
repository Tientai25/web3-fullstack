import React, { useContext, useState } from 'react'
import { useWallet } from '../hooks/useWallet.js'
import { DarkModeContext } from '../contexts/DarkModeContext.jsx'
import DocsModal from './modals/DocsModal'
import ContractsModal from './modals/ContractsModal'
import ApiModal from './modals/ApiModal'

export default function Header() {
  const { account, chainId, balance, connect } = useWallet()
  const { dark, setDark } = useContext(DarkModeContext)
  const [open, setOpen] = useState(false)
  const [activeModal, setActiveModal] = useState(null)

  const short = (addr) => addr ? `${addr.slice(0,6)}…${addr.slice(-4)}` : null

  return (
    <header className="w-full py-4">
      <div className="w-full max-w-[90rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold shadow">W3</div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold tracking-tight">Web3 Fullstack</h1>
              <div className="text-xs text-slate-500 dark:text-slate-300">MetaMask · ethers.js · web3.js</div>
            </div>
          </div>

          <nav role="navigation" className="hidden md:flex items-center gap-4">
            <button aria-label="Open documentation" onClick={() => setActiveModal('docs')} className="text-sm text-slate-600 dark:text-slate-300 hover:underline">Docs</button>
            <button aria-label="View contract information" onClick={() => setActiveModal('contracts')} className="text-sm text-slate-600 dark:text-slate-300 hover:underline">Contracts</button>
            <button aria-label="Open API demo" onClick={() => setActiveModal('api')} className="text-sm text-slate-600 dark:text-slate-300 hover:underline">API</button>
          </nav>

          <DocsModal isOpen={activeModal === 'docs'} onClose={() => setActiveModal(null)} />
          <ContractsModal isOpen={activeModal === 'contracts'} onClose={() => setActiveModal(null)} />
          <ApiModal isOpen={activeModal === 'api'} onClose={() => setActiveModal(null)} />

          <div className="flex items-center gap-3">
            <button aria-label="toggle theme" onClick={() => setDark(!dark)} className="h-9 w-9 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center">{
              dark ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a.75.75 0 01.75.75V4a.75.75 0 01-1.5 0V2.75A.75.75 0 0110 2zM10 16a.75.75 0 01.75.75V18a.75.75 0 01-1.5 0v-1.25A.75.75 0 0110 16zM4 10a.75.75 0 01.75-.75H6a.75.75 0 010 1.5H4.75A.75.75 0 014 10zM14 10a.75.75 0 01.75-.75H16a.75.75 0 010 1.5h-1.25A.75.75 0 0114 10zM5.64 5.64a.75.75 0 011.06 0l.88.88a.75.75 0 11-1.06 1.06l-.88-.88a.75.75 0 010-1.06zM13.42 13.42a.75.75 0 011.06 0l.88.88a.75.75 0 11-1.06 1.06l-.88-.88a.75.75 0 010-1.06zM13.42 6.58a.75.75 0 010 1.06l-.88.88a.75.75 0 11-1.06-1.06l.88-.88a.75.75 0 011.06 0zM6.54 13.46a.75.75 0 010 1.06l-.88.88a.75.75 0 11-1.06-1.06l.88-.88a.75.75 0 011.06 0z"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 116.707 2.707a7 7 0 0010.586 10.586z"/></svg>
              )
            }</button>

            <div className="hidden sm:flex sm:items-center sm:gap-3">
              {account ? (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center font-mono text-sm shrink-0">{short(account).slice(0,4)}</div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{short(account)}</div>
                    <div className="text-xs text-slate-400">{chainId ? `Chain ${chainId}` : ''} {balance ? ` · ${balance} ETH` : ''}</div>
                  </div>
                </div>
              ) : (
                <button aria-label="Connect wallet" onClick={connect} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">Connect Wallet</button>
              )}
            </div>

            {/* Mobile menu button */}
            <button aria-label="Toggle mobile menu" onClick={() => setOpen(!open)} className="md:hidden h-9 w-9 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center ml-2">
              {open ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 5h14M3 10h14M3 15h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile collapsible area */}
        {open && (
          <div className="mt-3 md:hidden p-3 bg-slate-50/60 dark:bg-slate-800/60 rounded-md">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{account ? short(account) : 'Not connected'}</div>
                  <div className="text-xs text-slate-500">{chainId ? `Chain ${chainId}` : ''}</div>
                </div>
                {account ? (
                  <div className="text-xs text-slate-400">{balance ? `${balance} ETH` : ''}</div>
                ) : (
                  <button onClick={connect} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">Connect</button>
                )}
              </div>

              <div className="flex flex-col border-t border-slate-100 dark:border-slate-700 pt-3">
                <button 
                  onClick={() => { setOpen(false); setActiveModal('docs'); }} 
                  className="text-left text-sm text-slate-600 dark:text-slate-300 py-1 hover:underline"
                >
                  Docs
                </button>
                <button 
                  onClick={() => { setOpen(false); setActiveModal('contracts'); }}
                  className="text-left text-sm text-slate-600 dark:text-slate-300 py-1 hover:underline"
                >
                  Contracts
                </button>
                <button 
                  onClick={() => { setOpen(false); setActiveModal('api'); }}
                  className="text-left text-sm text-slate-600 dark:text-slate-300 py-1 hover:underline"
                >
                  API
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
