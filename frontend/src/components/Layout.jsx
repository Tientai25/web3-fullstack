import React from 'react'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 from-slate-50 via-white to-slate-50 text-slate-900 dark:text-slate-100">
      <div className="w-full max-w-[90rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {children}
      </div>
    </div>
  )
}
