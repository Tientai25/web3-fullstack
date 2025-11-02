import React from 'react';
import { useNetwork } from '../contexts/NetworkContext';

export default function NetworkSelector() {
  const { 
    currentNetwork, 
    networkError, 
    isLoading, 
    switchNetwork, 
    supportedNetworks 
  } = useNetwork();

  const handleNetworkChange = async (e) => {
    const chainId = parseInt(e.target.value);
    try {
      await switchNetwork(chainId);
    } catch (error) {
      console.error('Lỗi chuyển mạng:', error);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Mạng hiện tại
        </label>
        {isLoading && (
          <span className="text-xs text-blue-600 dark:text-blue-400">
            Đang chuyển mạng...
          </span>
        )}
      </div>
      
      <select
        className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={currentNetwork?.chainId || ''}
        onChange={handleNetworkChange}
        disabled={isLoading}
      >
        <option value="" disabled>Chọn mạng</option>
        {Object.entries(supportedNetworks).map(([chainId, network]) => (
          <option key={chainId} value={chainId}>
            {network.name}
          </option>
        ))}
      </select>

      {networkError && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
          {networkError}
        </p>
      )}

      {currentNetwork && (
        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          <p>Symbol: {currentNetwork.symbol}</p>
          <p className="truncate">RPC: {currentNetwork.rpcUrl}</p>
          {currentNetwork.explorer && (
            <a
              href={currentNetwork.explorer}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Block Explorer
            </a>
          )}
        </div>
      )}
    </div>
  );
}