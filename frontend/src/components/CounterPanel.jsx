import React, { useEffect, useState } from "react";
import { getProvider, getSigner, makeContract } from "../lib/ethersClient.js";
import { getWeb3 } from "../lib/web3Client.js";
import { COUNTER_ADDRESS, COUNTER_ABI } from "../contract.js";

export default function CounterPanel() {
  const [value, setValue] = useState("?");
  const [events, setEvents] = useState([]);

  const loadValue = async () => {
    const provider = await getProvider();
    const c = makeContract(COUNTER_ADDRESS, COUNTER_ABI, provider);
    const v = await c.current();
    setValue(v.toString());
  };

  const callTx = async (fnName) => {
    const signer = await getSigner();
    const c = makeContract(COUNTER_ADDRESS, COUNTER_ABI, signer);
    const tx = await c[fnName]();
    await tx.wait();
    await loadValue();
  };

  useEffect(() => { loadValue(); }, []);

  // useEffect(() => {
  //   let timer;
  //   async function poll() {
  //     const web3 = getWeb3();
  //     const contract = new web3.eth.Contract(COUNTER_ABI, COUNTER_ADDRESS);
  //     const latest = await web3.eth.getBlockNumber();
  //     const evs = await contract.getPastEvents("ValueChanged", {
  //       fromBlock: Math.max(latest - 500, 0),
  //       toBlock: "latest"
  //     });
  //     const mapped = evs.reverse().slice(0, 10).map(e => ({
  //       tx: e.transactionHash,
  //       caller: e.returnValues.caller,
  //       newValue: e.returnValues.newValue,
  //       blockNumber: e.blockNumber
  //     }));
  //     setEvents(mapped);
  //   }
  //   poll();
  //   timer = setInterval(poll, 3000);
  //   return () => clearInterval(timer);
  // }, []);

  useEffect(() => {
    let timer;
    async function poll() {
      const web3 = getWeb3();
      const contract = new web3.eth.Contract(COUNTER_ABI, COUNTER_ADDRESS);
      const latestRaw = await web3.eth.getBlockNumber();
      // explicit conversion to Number to avoid mixing BigInt with numbers
      const latest = Number(latestRaw);
      const fromBlock = Math.max(latest - 500, 0);
      const evs = await contract.getPastEvents("ValueChanged", {
        fromBlock,
        toBlock: "latest"
      });
      const mapped = evs.reverse().slice(0, 10).map(e => {
        const rawNew = e.returnValues.newValue;
        // ensure newValue stored as string (safe for BigInt/BN/string)
        const newValue = (typeof rawNew === "bigint") ? rawNew.toString() : String(rawNew);
        return {
          tx: e.transactionHash,
          caller: e.returnValues.caller,
          newValue,
          blockNumber: e.blockNumber
        };
      });
      setEvents(mapped);
    }
    poll();
    timer = setInterval(poll, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{border:"1px solid #ddd", padding:12, borderRadius:8, marginTop:12}}>
      <h3>Counter</h3>
      <div style={{fontSize:24}}>Current: <b>{value}</b></div>
      <div style={{marginTop:8, display:"flex", gap:8}}>
        <button onClick={() => callTx("increment")}>Increment</button>
        <button onClick={() => callTx("decrement")}>Decrement</button>
        <button onClick={loadValue}>Reload</button>
      </div>

      <h4 style={{marginTop:16}}>Recent Events (web3.js)</h4>
      <ul>
        {events.map((e, i) => (
          <li key={i}>
            #{e.blockNumber} – caller: {e.caller.slice(0,6)}… newValue: {e.newValue.toString()} – tx: {e.tx.slice(0,10)}…
          </li>
        ))}
      </ul>
    </div>
  );
}
