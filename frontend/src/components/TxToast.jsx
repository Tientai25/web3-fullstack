import React, { useContext } from 'react'
import { TransactionContext } from '../contexts/TransactionContext.jsx'

export default function TxToast() {
  const { txs } = useContext(TransactionContext)
  const pending = txs.filter(t => t.status === 'pending')

  if (pending.length === 0) return null

  return (
    <div className="fixed left-4 bottom-4 z-50 space-y-2">
      {pending.slice(0,3).map(t => (
        <div key={t.hash} className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2 rounded-md shadow">
          <div className="font-medium">{t.action} — Đang chờ</div>
          <div className="text-xs">Tx: <a className="underline" href={`https://etherscan.io/tx/${t.hash}`} target="_blank" rel="noreferrer">{t.hash.slice(0,10)}…</a></div>
        </div>
      ))}
    </div>
  )
}
