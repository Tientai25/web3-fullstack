import React from 'react'

export default function DocsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-semibold">Tài liệu hướng dẫn</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="prose dark:prose-invert max-w-none">
            <h3>Hướng dẫn sử dụng nhanh</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Web3 Fullstack Demo là một ứng dụng cho phép tương tác với smart contract thông qua MetaMask, 
              sử dụng ethers.js để đọc dữ liệu và web3.js để theo dõi events.
            </p>

            <h4>Các bước thiết lập:</h4>
            <ol className="space-y-2 text-slate-600 dark:text-slate-300">
              <li>
                <strong>MetaMask:</strong> Thêm mạng Localhost 8545 (ChainId: 31337)
              </li>
              <li>
                <strong>Import tài khoản:</strong> Lấy private key từ output của Hardhat node
              </li>
              <li>
                <strong>Kết nối ví:</strong> Click nút "Connect Wallet" ở góc phải
              </li>
            </ol>

            <h4>Tương tác với Counter:</h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              <li>Xem giá trị hiện tại trong Counter Panel</li>
              <li>Dùng nút Increment/Decrement để thay đổi giá trị</li>
              <li>Theo dõi giao dịch qua TxToast và danh sách Recent Events</li>
            </ul>

            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Thông tin kỹ thuật:</h4>
              <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <li>• Frontend: Vite + React + Tailwind CSS</li>
                <li>• Smart Contract: Solidity + Hardhat</li>
                <li>• Backend API: Express + ethers.js/web3.js</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}