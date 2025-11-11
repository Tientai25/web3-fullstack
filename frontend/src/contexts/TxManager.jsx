import React, { createContext, useContext } from 'react'
import { getSigner, getProvider } from '../lib/ethersClient.js'
import { TransactionContext } from './TransactionContext.jsx'

export const TxManagerContext = createContext(null)

// presets: slow, normal, fast
const PRESETS = {
  slow: 100,
  normal: 120,
  fast: 160
}

export function TxManagerProvider({ children }) {
  const txCtx = useContext(TransactionContext)

  async function sendContractTx(contract, fnName, args = [], action = fnName, preset = 'normal') {
    if (!contract || !contract[fnName]) throw new Error('Invalid contract or function')
    const signer = await getSigner()
    const provider = await getProvider()

    // estimate gas - sửa cách gọi cho ethers v6
    let gasLimit
    try {
      // Trong ethers v6, có thể dùng contract[fnName].estimateGas() hoặc contract.estimateGas[fnName]
      // Thử cả 2 cách để tương thích
      if (contract[fnName]?.estimateGas) {
        gasLimit = await contract[fnName].estimateGas(...args)
      } else if (contract.estimateGas?.[fnName]) {
        gasLimit = await contract.estimateGas[fnName](...args)
      } else {
        // Fallback: tạo contract instance với signer để estimate
        const connectedContract = contract.connect(signer)
        gasLimit = await connectedContract[fnName].estimateGas(...args)
      }
      // add 10% buffer
      gasLimit = gasLimit * BigInt(110) / BigInt(100)
    } catch (err) {
      // Không log warning nếu chỉ là fallback bình thường
      gasLimit = BigInt(300_000)
    }

    // fee data - xử lý mạng không hỗ trợ EIP-1559
    let feeData
    try {
      feeData = await provider.getFeeData()
    } catch (err) {
      // Nếu getFeeData fail (mạng không hỗ trợ EIP-1559), dùng gasPrice
      const gasPrice = await provider.getGasPrice()
      feeData = {
        gasPrice,
        maxFeePerGas: gasPrice,
        maxPriorityFeePerGas: gasPrice,
      }
    }
    const baseMax = feeData.maxFeePerGas ?? feeData.gasPrice ?? BigInt(0)
    const basePriority = feeData.maxPriorityFeePerGas ?? feeData.gasPrice ?? BigInt(0)
    const mul = PRESETS[preset] ?? PRESETS.normal
    const maxFee = baseMax * BigInt(mul) / BigInt(100)
    const maxPriority = basePriority * BigInt(mul) / BigInt(100)

    // send transaction via contract method with overrides
    const overrides = {
      gasLimit: gasLimit,
      maxFeePerGas: maxFee,
      maxPriorityFeePerGas: maxPriority
    }

    const txResponse = await contract.connect(signer)[fnName](...args, overrides)

    // record tx with meta (to, data, nonce) for potential speedup
    try {
      txCtx.addTx({ hash: txResponse.hash, action, status: 'pending', meta: { to: txResponse.to, data: txResponse.data, nonce: txResponse.nonce } })
    } catch (e) { console.warn('addTx failed', e) }

    const receipt = await txResponse.wait()
    txCtx.updateTx(txResponse.hash, { status: 'confirmed', blockNumber: receipt.blockNumber })
    return receipt
  }

  async function speedUp(hash) {
    // find tx
    const tx = txCtx.txs.find(t => t.hash === hash)
    if (!tx || tx.status !== 'pending') throw new Error('Tx not found or not pending')

    const signer = await getSigner()
    const provider = await getProvider()
    const feeData = await provider.getFeeData()
    const baseMax = feeData.maxFeePerGas ?? feeData.gasPrice ?? BigInt(0)
    const basePriority = feeData.maxPriorityFeePerGas ?? feeData.gasPrice ?? BigInt(0)
    // bump 30% over current base
    const bump = BigInt(130)
    const maxFee = baseMax * bump / BigInt(100)
    const maxPriority = basePriority * bump / BigInt(100)

    const txRequest = {
      to: tx.meta?.to,
      data: tx.meta?.data,
      nonce: tx.meta?.nonce,
      maxFeePerGas: maxFee,
      maxPriorityFeePerGas: maxPriority
    }

    const newTx = await signer.sendTransaction(txRequest)
    txCtx.addTx({ hash: newTx.hash, action: `${tx.action} (speedup)`, status: 'pending', meta: { ...tx.meta, nonce: tx.meta?.nonce } })
    // optionally mark old tx as replaced
    txCtx.updateTx(hash, { status: 'failed', meta: { ...tx.meta, replacedBy: newTx.hash } })

    const rec = await newTx.wait()
    txCtx.updateTx(newTx.hash, { status: 'confirmed', blockNumber: rec.blockNumber })
    return rec
  }

  return (
    <TxManagerContext.Provider value={{ sendContractTx, speedUp }}>
      {children}
    </TxManagerContext.Provider>
  )
}
