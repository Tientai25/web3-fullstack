import React, { useState } from 'react'

export default function ApiModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState({});
  const [results, setResults] = useState({});

  const checkEndpoint = async (endpoint) => {
    setLoading(prev => ({ ...prev, [endpoint]: true }));
    try {
      const res = await fetch(`http://localhost:4000/api/${endpoint}`);
      const data = await res.json();
      setResults(prev => ({ ...prev, [endpoint]: data }));
    } catch (err) {
      setResults(prev => ({ ...prev, [endpoint]: { error: err.message } }));
    } finally {
      setLoading(prev => ({ ...prev, [endpoint]: false }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl">
        <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-semibold">API Demo</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">GET /api/health</h3>
                <button 
                  onClick={() => checkEndpoint('health')}
                  className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded"
                  disabled={loading.health}
                >
                  {loading.health ? 'Checking...' : 'Test'}
                </button>
              </div>
              {results.health && (
                <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <pre className="text-sm"><code>{JSON.stringify(results.health, null, 2)}</code></pre>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">GET /api/counter/value</h3>
                <button 
                  onClick={() => checkEndpoint('counter/value')}
                  className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded"
                  disabled={loading['counter/value']}
                >
                  {loading['counter/value'] ? 'Loading...' : 'Test'}
                </button>
              </div>
              {results['counter/value'] && (
                <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <pre className="text-sm"><code>{JSON.stringify(results['counter/value'], null, 2)}</code></pre>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">GET /api/counter/events</h3>
                <button 
                  onClick={() => checkEndpoint('counter/events')}
                  className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded"
                  disabled={loading['counter/events']}
                >
                  {loading['counter/events'] ? 'Loading...' : 'Test'}
                </button>
              </div>
              {results['counter/events'] && (
                <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg overflow-auto max-h-48">
                  <pre className="text-sm"><code>{JSON.stringify(results['counter/events'], null, 2)}</code></pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}