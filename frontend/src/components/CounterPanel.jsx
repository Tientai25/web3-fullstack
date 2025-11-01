import React, { useEffect, useState, useContext } from "react";
import { getProvider, getSigner, makeContract } from "../lib/ethersClient.js";
import { getWeb3 } from "../lib/web3Client.js";
import { COUNTER_ADDRESS, COUNTER_ABI } from "../contract.js";
import { TransactionContext } from '../contexts/TransactionContext.jsx'
import { TxManagerContext } from '../contexts/TxManager.jsx'

export default function CounterPanel() {
  const [value, setValue] = useState("?");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addTx, updateTx } = useContext(TransactionContext)
  const { sendContractTx } = useContext(TxManagerContext)

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
      const provider = await getProvider();
      const c = makeContract(COUNTER_ADDRESS, COUNTER_ABI, provider);
      // delegate sending to TxManager which will add/update txs and handle gas presets
      if (sendContractTx) {
        await sendContractTx(c, fnName, [], fnName, 'normal')
      } else {
        // fallback: direct signer call
        const signer = await getSigner();
        const c2 = makeContract(COUNTER_ADDRESS, COUNTER_ABI, signer);
        const tx = await c2[fnName]()
        const receipt = await tx.wait()
      }
      await loadValue();
    } catch (err) {
      console.error('tx error', err);
      // if tx has hash property (some providers attach it on error), mark failed
      const maybeHash = err?.transactionHash || err?.hash
      if (maybeHash && updateTx) updateTx(maybeHash, { status: 'failed' })
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadValue(); }, []);

  useEffect(() => {
    let timer;
    async function poll() {
      try {
        const web3 = getWeb3();
        const contract = new web3.eth.Contract(COUNTER_ABI, COUNTER_ADDRESS);
        const latestRaw = await web3.eth.getBlockNumber();
        const latest = Number(latestRaw);
        const fromBlock = Math.max(latest - 500, 0);
        const evs = await contract.getPastEvents("ValueChanged", {
          fromBlock,
          toBlock: "latest"
        });
        const mapped = evs.reverse().slice(0, 10).map(e => {
          const rawNew = e.returnValues.newValue;
          const newValue = (typeof rawNew === "bigint") ? rawNew.toString() : String(rawNew);
          return {
            tx: e.transactionHash,
            caller: e.returnValues.caller,
            newValue,
            blockNumber: e.blockNumber
          };
        });
        setEvents(mapped);
      } catch (err) {
        console.error('poll events', err);
      }
    }
    poll();
    timer = setInterval(poll, 3000);
    return () => clearInterval(timer);
  }, []);

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
            {events.length === 0 ? (
              <div className="p-4 text-xs text-slate-400 text-center">No recent events found.</div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {events.map((e, i) => (
                  <li key={i} className="p-3 hover:bg-slate-50/50">
                    <div className="flex items-start gap-3">
                      <div className="text-xs text-slate-400 hidden sm:block">#{e.blockNumber}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm truncate">
                          {e.caller.slice(0,6)}… → <span className="font-mono">{e.newValue}</span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2">
                          <span className="sm:hidden">#{e.blockNumber}</span>
                          <span>tx: {e.tx.slice(0,10)}…</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
