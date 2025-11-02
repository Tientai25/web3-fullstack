import React from "react";
import './index.css'
import Layout from './components/Layout.jsx'
import Header from './components/Header.jsx'
import WalletPanel from "./components/WalletPanel.jsx";
import CounterPanel from "./components/CounterPanel.jsx";
import StatsPanel from "./components/StatsPanel.jsx";
import { TransactionProvider } from './contexts/TransactionContext.jsx'
import { TxManagerProvider } from './contexts/TxManager.jsx'
import { DarkModeProvider } from './contexts/DarkModeContext.jsx'
import { NetworkProvider } from './contexts/NetworkContext.jsx'
import { NFTProvider } from './contexts/NFTContext.jsx'
import TxList from './components/TxList.jsx'
import TxToast from './components/TxToast.jsx'
import Footer from './components/Footer.jsx'
import MintCertificateForm from './components/MintCertificateForm.jsx'
import CertificateGallery from './components/CertificateGallery.jsx'

export default function App() {
  return (
    <DarkModeProvider>
      <NetworkProvider>
        <NFTProvider>
          <TransactionProvider>
            <TxManagerProvider>
          <Layout>
          <Header />

          <main className="max-w-6xl mx-auto px-4">
            <section className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white rounded-3xl p-8 shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Web3 Fullstack Demo</h2>
                  <p className="mt-1 text-slate-100/90">A small demo showing MetaMask, ethers.js and web3.js working together.</p>
                </div>
                <div>
                  <a className="inline-block px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md">View on Explorer</a>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <StatsPanel />
              <WalletPanel />
              <CounterPanel />
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6">NFT Achievements</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MintCertificateForm />
                <CertificateGallery />
              </div>
            </div>
          </main>

          <Footer />
          <TxToast />
          <TxList />
          </Layout>
        </TxManagerProvider>
      </TransactionProvider>
    </NFTProvider>
    </NetworkProvider>
    </DarkModeProvider>
  );
}
