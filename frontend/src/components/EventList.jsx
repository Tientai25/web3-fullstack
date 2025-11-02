import React, { useEffect, useState } from 'react';
import { getProvider } from '../lib/ethersClient';
import { makeContract } from '../lib/ethersClient';
import { COUNTER_ADDRESS, COUNTER_ABI } from '../contract';

export default function EventList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    let timer;
    let lastProcessedBlock = 0;

    async function pollEvents() {
      try {
        const provider = await getProvider();
        const contract = makeContract(COUNTER_ADDRESS, COUNTER_ABI, provider);
        
        const currentBlock = await provider.getBlockNumber();
        
        // First time polling
        if (lastProcessedBlock === 0) {
          lastProcessedBlock = Math.max(currentBlock - 500, 0);
        }

        // Only get new events
        if (currentBlock > lastProcessedBlock) {
          const filter = contract.filters.ValueChanged();
          const newEvents = await contract.queryFilter(filter, lastProcessedBlock + 1, currentBlock);

          const mappedEvents = newEvents.map(event => ({
            tx: event.transactionHash,
            caller: event.args[0],
            newValue: event.args[1].toString(),
            blockNumber: event.blockNumber
          }));

          setEvents(prev => {
            const combined = [...mappedEvents.reverse(), ...prev];
            return combined.slice(0, 10); // Keep only 10 most recent events
          });

          lastProcessedBlock = currentBlock;
        }
      } catch (err) {
        console.error('Error polling events:', err);
      }
    }

    // Initial poll and set interval
    pollEvents();
    timer = setInterval(pollEvents, 3000);

    return () => clearInterval(timer);
  }, []);

  if (events.length === 0) {
    return (
      <div className="p-4 text-xs text-slate-400 text-center">
        No recent events found.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-100">
      {events.map((e, i) => (
        <li key={e.tx + i} className="p-3 hover:bg-slate-50/50">
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
  );
}