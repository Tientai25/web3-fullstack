import React, { createContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'txHistory_v1'

export const TransactionContext = createContext(null)

export function TransactionProvider({ children }) {
  const [txs, setTxs] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setTxs(JSON.parse(raw))
    } catch (err) {
      console.warn('load tx history', err)
    }
  }, [])

  const persist = (newTxs) => {
    setTxs(newTxs)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newTxs)) } catch (e) {}
  }

  const addTx = ({ hash, action, status = 'pending', meta = {} }) => {
    if (!hash) return null
    const entry = {
      hash,
      action: action || 'tx',
      status,
      meta,
      timestamp: Date.now(),
      blockNumber: null,
    }
    const newTxs = [entry, ...txs].slice(0, 200)
    persist(newTxs)
    return hash
  }

  const updateTx = (hash, updates = {}) => {
    const newTxs = txs.map(t => t.hash === hash ? { ...t, ...updates } : t)
    persist(newTxs)
  }

  const clearAll = () => { persist([]) }

  return (
    <TransactionContext.Provider value={{ txs, addTx, updateTx, clearAll }}>
      {children}
    </TransactionContext.Provider>
  )
}
