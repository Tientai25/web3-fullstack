import React, { useEffect, useState, useContext } from 'react'
import { TransactionContext } from '../contexts/TransactionContext.jsx'

export default function StatsPanel() {
  const [value, setValue] = useState('?')
  const [eventsCount, setEventsCount] = useState(0)
  const [healthy, setHealthy] = useState(false)
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const h = await fetch('http://localhost:4000/api/health')
      const hjson = await h.json()
      setHealthy(!!hjson.ok)
    } catch (e) {
      setHealthy(false)
    }

    try {
      const v = await fetch('http://localhost:4000/api/counter/value')
      const vj = await v.json()
      setValue(vj.value ?? '—')
    } catch (e) {
      setValue('—')
    }

    try {
      const ev = await fetch('http://localhost:4000/api/counter/events')
      const ej = await ev.json()
      setEventsCount((ej.events && ej.events.length) || 0)
    } catch (e) {
      setEventsCount(0)
    }

    setLoading(false)
  }

  useEffect(() => {
    load()
    const t = setInterval(() => load(), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Stats</h3>
          <p className="text-sm text-slate-500">Quick blockchain & contract stats</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded">
          <div className="text-xs text-slate-500">Contract Value</div>
          <div className="text-lg font-semibold">{loading ? '…' : value}</div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded">
          <div className="text-xs text-slate-500">Events (recent)</div>
          <div className="text-lg font-semibold">{eventsCount}</div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded">
          <div className="text-xs text-slate-500">API Health</div>
          <div className={`text-lg font-semibold ${healthy ? 'text-emerald-600' : 'text-rose-500'}`}>{healthy ? 'OK' : 'DOWN'}</div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded">
          <div className="text-xs text-slate-500">Last update</div>
          <div className="text-lg font-semibold">{new Date().toLocaleTimeString()}</div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-slate-500">Auto-refresh: 5s</div>
        <div>
          <GenerateReportButton loading={loading} value={value} eventsCount={eventsCount} healthy={healthy} />
        </div>
      </div>
    </div>
  )
}

function GenerateReportButton({ loading, value, eventsCount, healthy }) {
  const { txs } = useContext(TransactionContext)

  const buildReportMarkdown = async () => {
    const contract = import.meta.env.VITE_COUNTER_ADDRESS || '(not configured)'
    const now = new Date().toISOString()

    // try to fetch recent events snapshot
    let events = []
    try {
      const r = await fetch('http://localhost:4000/api/counter/events')
      const j = await r.json()
      events = j.events || []
    } catch (e) {
      events = []
    }

    const md = []
    md.push('# Demo report — Web3 Fullstack')
    md.push(`Generated: ${now}`)
    md.push('')
    md.push('## Environment')
    md.push(`- Contract: \`${contract}\``)
    md.push(`- API health: ${healthy ? 'OK' : 'DOWN'}`)
    md.push('')
    md.push('## Contract')
    md.push(`- Current value: ${value}`)
    md.push(`- Recent events (count): ${eventsCount}`)
    md.push('')
    md.push('## Recent events (top 5)')
    if (events.length === 0) md.push('- None')
    else {
      events.slice(0,5).forEach(ev => {
        md.push(`- tx: \`${ev.tx}\` caller: \`${ev.caller}\` newValue: ${ev.newValue} (block ${ev.blockNumber})`)
      })
    }
    md.push('')
    md.push('## Transactions (local history)')
    if (!txs || txs.length === 0) md.push('- No transactions recorded locally')
    else {
      md.push(`- Total recorded: ${txs.length}`)
      md.push('')
      md.push('| action | status | timestamp | tx |')
      md.push('|---|---:|---|---|')
      txs.slice(0,20).forEach(t => {
        md.push(`| ${t.action} | ${t.status} | ${new Date(t.timestamp).toLocaleString()} | \`${t.hash}\` |`)
      })
    }

    return md.join('\n')
  }

  const download = async () => {
    const content = await buildReportMarkdown()
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `demo-report-${new Date().toISOString().replace(/[:.]/g,'-')}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button onClick={download} disabled={loading} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm">
      Generate Report
    </button>
  )
}
