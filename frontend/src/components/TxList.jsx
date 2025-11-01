import React, { useContext } from 'react'
import { TransactionContext } from '../contexts/TransactionContext.jsx'
import { TxManagerContext } from '../contexts/TxManager.jsx'

function short(h) { return h ? `${h.slice(0,6)}…${h.slice(-4)}` : '' }

export default function TxList() {
  const { txs, clearAll } = useContext(TransactionContext)
  const { speedUp } = useContext(TxManagerContext)

  const exportCSV = () => {
    if (!txs || txs.length === 0) return
    const rows = [['hash','action','status','timestamp','blockNumber']]
    txs.forEach(t => rows.push([t.hash, t.action, t.status, new Date(t.timestamp).toISOString(), t.blockNumber ?? '']))
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tx_history.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <aside className="fixed right-4 bottom-4 w-96 max-w-full z-50">
      <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl shadow p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Transactions</div>
          <div className="flex items-center gap-2">
            <button onClick={exportCSV} className="text-xs text-slate-600 hover:text-slate-800">Export CSV</button>
            <button onClick={clearAll} className="text-xs text-slate-400 hover:text-slate-600">Clear</button>
          </div>
        </div>

        <div className="mt-3 max-h-64 overflow-auto text-sm text-slate-700">
          {txs.length === 0 ? (
            <div className="text-xs text-slate-400">No transactions yet.</div>
          ) : (
            <ul className="space-y-3">
              {txs.map((t, i) => (
                <li key={t.hash + i} className="flex items-start gap-3">
                  <div className="w-2 mt-1">
                    {t.status === 'pending' && <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                    {t.status === 'confirmed' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                    {t.status === 'failed' && <div className="w-2 h-2 rounded-full bg-red-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium">{t.action}</div>
                      <div className="flex items-center gap-2">
                        {t.status === 'pending' && (
                          <button onClick={() => speedUp(t.hash)} className="text-xs bg-yellow-100 px-2 py-1 rounded-md">Speed up</button>
                        )}
                        <a className="text-xs text-slate-400" target="_blank" rel="noreferrer" href={`https://etherscan.io/tx/${t.hash}`}>{short(t.hash)}</a>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">{new Date(t.timestamp).toLocaleString()} {t.blockNumber ? ` · block ${t.blockNumber}` : ''}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  )
}
