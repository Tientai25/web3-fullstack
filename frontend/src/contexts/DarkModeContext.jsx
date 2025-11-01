import React, { createContext, useEffect, useState } from 'react'

export const DarkModeContext = createContext(null)

const KEY = 'pref_dark'

export function DarkModeProvider({ children }) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw !== null) setDark(raw === '1')
      else {
        // default to system preference
        const prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        setDark(prefers)
      }
    } catch (e) { /* ignore */ }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (dark) root.classList.add('dark')
    else root.classList.remove('dark')
    try { localStorage.setItem(KEY, dark ? '1' : '0') } catch(e){}
  }, [dark])

  return (
    <DarkModeContext.Provider value={{ dark, setDark }}>
      {children}
    </DarkModeContext.Provider>
  )
}
