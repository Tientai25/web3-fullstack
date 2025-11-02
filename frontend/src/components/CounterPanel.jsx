import React, { useEffect, useState, useContext } from "react";
import { getProvider, getSigner, makeContract } from "../lib/ethersClient.js";
import { COUNTER_ADDRESS, COUNTER_ABI } from "../contract.js";
import { TransactionContext } from '../contexts/TransactionContext.jsx';
import { TxManagerContext } from '../contexts/TxManager.jsx';
import EventList from './EventList';

export default function CounterPanel() {
  const [value, setValue] = useState("?");
  const [loading, setLoading] = useState(false);
  const { addTx, updateTx } = useContext(TransactionContext);
  const { sendContractTx } = useContext(TxManagerContext);

  const loadValue = async () => {
    try {
      const provider = await getProvider();
      const c = makeContract(COUNTER_ADDRESS, COUNTER_ABI, provider);
      const v = await c.current();
      setValue(v.toString());
    } catch (err) {
      console.error('loadValue', err);
      setValue('—');
    }
  };

  const callTx = async (fnName) => {
    try {
      setLoading(true);
      const signer = await getSigner();
      const c = makeContract(COUNTER_ADDRESS, COUNTER_ABI, signer);
      
      if (sendContractTx) {
        // Đảm bảo contract được kết nối với signer
        const connectedContract = c.connect(signer);
        await sendContractTx(connectedContract, fnName, [], fnName, 'normal');
      } else {
        // Fallback không sử dụng TxManager
        const tx = await c[fnName]();
        // ensure fallback txs are recorded in tx history
        try {
          addTx({ hash: tx.hash, action: fnName, status: 'pending', meta: { to: tx.to, data: tx.data, nonce: tx.nonce } });
        } catch (e) { console.warn('addTx failed (fallback)', e) }
        const receipt = await tx.wait();
        try { updateTx(tx.hash, { status: 'confirmed', blockNumber: receipt.blockNumber }) } catch(e){}
      }
      await loadValue();
    } catch (err) {
      console.error('tx error', err);
      if (err.code === 4001) {
        // User rejected transaction
        console.log('Transaction was rejected by user');
      } else {
        // Other errors
        const maybeHash = err?.transactionHash || err?.hash;
        if (maybeHash && updateTx) {
          updateTx(maybeHash, { status: 'failed' });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadValue(); }, []);

  return (
    <div className="bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm mt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Counter</h3>
          <p className="text-sm text-slate-500">A simple on-chain counter contract — view and update the value.</p>
        </div>

        <div className="w-full sm:w-auto text-left sm:text-right bg-slate-50/50 sm:bg-transparent p-3 sm:p-0 rounded-lg">
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs text-slate-400">Current value</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
        <button onClick={() => callTx('increment')} disabled={loading} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm sm:text-base">Increment</button>
        <button onClick={() => callTx('decrement')} disabled={loading} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm sm:text-base">Decrement</button>
        <button onClick={loadValue} className="col-span-2 sm:col-span-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-sm sm:text-base">Reload</button>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium mb-3">Recent Events</h4>
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <div className="max-h-44 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
            <EventList />
          </div>
        </div>
      </div>
    </div>
  );
}
