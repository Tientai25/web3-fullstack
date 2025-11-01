import { useEffect, useState } from "react";
import { getProvider, getSigner, getBalance } from "../lib/ethersClient.js";

export function useWallet() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState(null);
  const [ens, setEns] = useState(null);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accs) => setAccount(accs[0] || null);
    const handleChainChanged = (cid) => setChainId(parseInt(cid, 16));

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  async function connect() {
    const signer = await getSigner();
    const addr = await (await signer).getAddress();
    setAccount(addr);
    const provider = await getProvider();
    const { chainId } = await provider.getNetwork();
    setChainId(Number(chainId));
    setBalance(await getBalance(addr));
    try {
      // lookup ENS name (may be null)
      const name = await provider.lookupAddress(addr)
      setEns(name)
    } catch (e) { console.warn('ens lookup', e) }
  }

  return { account, chainId, balance, ens, connect };
}
