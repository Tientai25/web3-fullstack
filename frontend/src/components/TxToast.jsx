import React, { useContext } from 'react'
import { TransactionContext } from '../contexts/TransactionContext.jsx'

function explorerFor(hash) {
  const network = import.meta.env.VITE_NETWORK || 'mainnet'
  // basic mapping, extendable
  if (network.includes('sepolia') || network.includes('sep')) return `https://sepolia.etherscan.io/tx/${hash}`
  if (network.includes('goerli')) return `https://goerli.etherscan.io/tx/${hash}`
  return `https://etherscan.io/tx/${hash}`
}

export default function TxToast() {
  const { txs } = useContext(TransactionContext)
  const pending = txs.filter(t => t.status === 'pending')

  if (pending.length === 0) return null

  return (
    <div aria-live="polite" className="fixed left-4 bottom-4 z-50 space-y-3">
      {pending.slice(0,3).map(t => (
        <div key={t.hash} className="bg-white/95 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-lg shadow-lg w-80">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">{t.action} <span className="text-xs text-amber-500">· Đang chờ</span></div>
              <div className="text-xs text-slate-500 mt-1">{new Date(t.timestamp).toLocaleTimeString()}</div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <a className="text-xs text-slate-500 underline" href={explorerFor(t.hash)} target="_blank" rel="noreferrer">Open</a>
              <div className="text-xs text-slate-400">{t.hash.slice(0,8)}…</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
