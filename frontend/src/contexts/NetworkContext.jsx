import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const NetworkContext = createContext();

const SUPPORTED_NETWORKS = {
  // Mainnet
  1: {
    name: 'Ethereum Mainnet',
    rpcUrl: `https://mainnet.infura.io/v3/${import.meta.env.VITE_INFURA_ID}`,
    explorer: 'https://etherscan.io',
    symbol: 'ETH',
    decimals: 18
  },
  // Testnet
  11155111: {
    name: 'Sepolia Testnet',
    rpcUrl: `https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_ID}`,
    explorer: 'https://sepolia.etherscan.io',
    symbol: 'SepoliaETH',
    decimals: 18
  },
  // Local
  31337: {
    name: 'Localhost',
    rpcUrl: 'http://127.0.0.1:8545',
    explorer: '',
    symbol: 'ETH',
    decimals: 18
  },
  // BSC
  56: {
    name: 'BNB Smart Chain',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorer: 'https://bscscan.com',
    symbol: 'BNB',
    decimals: 18
  },
  // Polygon
  137: {
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    symbol: 'MATIC',
    decimals: 18
  }
};

export function NetworkProvider({ children }) {
  const [currentNetwork, setCurrentNetwork] = useState(null);
  const [networkError, setNetworkError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Theo dõi thay đổi mạng từ MetaMask
  useEffect(() => {
    if (!window.ethereum) return;

    const handleChainChanged = (chainId) => {
      const networkId = parseInt(chainId, 16);
      if (SUPPORTED_NETWORKS[networkId]) {
        setCurrentNetwork(SUPPORTED_NETWORKS[networkId]);
        setNetworkError(null);
      } else {
        setNetworkError('Mạng không được hỗ trợ');
      }
    };

    window.ethereum.on('chainChanged', handleChainChanged);
    return () => {
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  // Hàm thêm/chuyển đổi mạng
  const switchNetwork = async (chainId) => {
    if (!window.ethereum) {
      throw new Error('MetaMask không được cài đặt');
    }

    const network = SUPPORTED_NETWORKS[chainId];
    if (!network) {
      throw new Error('Mạng không được hỗ trợ');
    }

    setIsLoading(true);
    try {
      // Thử chuyển đổi sang mạng
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error) {
      if (error.code === 4902) {
        // Nếu mạng chưa được thêm, thêm mới
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
                chainName: network.name,
                nativeCurrency: {
                  name: network.symbol,
                  symbol: network.symbol,
                  decimals: network.decimals,
                },
                rpcUrls: [network.rpcUrl],
                blockExplorerUrls: network.explorer ? [network.explorer] : undefined,
              },
            ],
          });
        } catch (addError) {
          throw new Error('Không thể thêm mạng mới');
        }
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm lấy explorer URL cho transaction
  const getExplorerUrl = (txHash) => {
    if (!currentNetwork?.explorer) return '';
    return `${currentNetwork.explorer}/tx/${txHash}`;
  };

  const value = {
    currentNetwork,
    networkError,
    isLoading,
    switchNetwork,
    getExplorerUrl,
    supportedNetworks: SUPPORTED_NETWORKS
  };

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
}

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork phải được sử dụng trong NetworkProvider');
  }
  return context;
};