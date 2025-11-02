import React from 'react'

export default function ContractsModal({ isOpen, onClose }) {
  const contractAddress = import.meta.env.VITE_COUNTER_ADDRESS || '(chưa cấu hình)';
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl">
        <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-semibold">Thông tin Smart Contract</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Địa chỉ hợp đồng</h3>
              <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <code className="text-sm font-mono break-all">{contractAddress}</code>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">ABI (Tóm tắt)</h3>
              <div className="mt-2 space-y-2 text-sm">
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/50 font-mono">function current() view returns (int256)</div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/50 font-mono">function increment()</div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/50 font-mono">function decrement()</div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/50 font-mono">event ValueChanged(address indexed caller, int256 newValue)</div>
              </div>
            </div>

            <div className="rounded-lg bg-slate-100 dark:bg-slate-900/70 p-4">
              <h4 className="font-medium mb-2">Hướng dẫn thêm vào MetaMask:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <li>Mở MetaMask, chuyển sang mạng Localhost 8545</li>
                <li>Click "Import tokens"</li>
                <li>Paste địa chỉ contract vào trường "Token Address"</li>
                <li>Click "Add Custom Token"</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}