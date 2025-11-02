import React, { createContext, useContext, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../hooks/useWallet';

const NFTContext = createContext();

// Hàm helper để upload lên NFT.Storage
async function uploadToNFTStorage(file, metadata) {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    // Upload file lên nft.storage
    const response = await fetch('https://api.nft.storage/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_NFT_STORAGE_KEY}`,
      },
      body: formData
    });
    
    const { value: { cid: imageCid } } = await response.json();
    
    // Tạo metadata
    const nftMetadata = {
      name: metadata.title,
      description: metadata.description,
      image: `https://ipfs.io/ipfs/${imageCid}`,
      attributes: [
        {
          trait_type: "Achievement Type",
          value: metadata.achievementType
        },
        {
          trait_type: "Issue Date",
          value: new Date().toISOString()
        }
      ]
    };
    
    // Upload metadata
    const metadataResponse = await fetch('https://api.nft.storage/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_NFT_STORAGE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nftMetadata)
    });
    
    const { value: { cid: metadataCid } } = await metadataResponse.json();
    return `https://ipfs.io/ipfs/${metadataCid}`;
  } catch (error) {
    console.error('Error uploading to NFT.Storage:', error);
    throw new Error('Không thể upload lên NFT.Storage');
  }
}

export function NFTProvider({ children }) {
  const { account } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [userCertificates, setUserCertificates] = useState([]);
  const [error, setError] = useState(null);

  // Upload metadata lên NFT.Storage
  const uploadToIPFS = uploadToNFTStorage;

  // Mint certificate mới
  const mintCertificate = async (file, metadata) => {
    try {
      setIsLoading(true);
      setError(null);

      // Upload lên IPFS và lấy tokenURI
      const tokenURI = await uploadToIPFS(file, metadata);

      // Gọi smart contract để mint NFT
      const contract = new ethers.Contract(
        import.meta.env.VITE_CERTIFICATE_NFT_ADDRESS,
        ['function mintCertificate(address to, string memory title, string memory achievementType, string memory tokenURI)'],
        new ethers.providers.Web3Provider(window.ethereum).getSigner()
      );

      const tx = await contract.mintCertificate(
        account,
        metadata.title,
        metadata.achievementType,
        tokenURI
      );
      await tx.wait();

      // Cập nhật danh sách certificates
      fetchUserCertificates();

      return tx.hash;
    } catch (error) {
      console.error('Error minting certificate:', error);
      setError('Không thể mint certificate');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Lấy danh sách certificates của user
  const fetchUserCertificates = useCallback(async () => {
    if (!account) return;

    try {
      setIsLoading(true);
      const contract = new ethers.Contract(
        import.meta.env.VITE_CERTIFICATE_NFT_ADDRESS,
        [
          'function getCertificatesByOwner(address) view returns (uint256[])',
          'function getCertificateDetails(uint256) view returns (tuple(string title, string issueDate, string achievementType, address recipient))',
          'function tokenURI(uint256) view returns (string)'
        ],
        new ethers.providers.Web3Provider(window.ethereum)
      );

      const tokenIds = await contract.getCertificatesByOwner(account);
      
      const certificates = await Promise.all(
        tokenIds.map(async (id) => {
          const details = await contract.getCertificateDetails(id);
          const uri = await contract.tokenURI(id);
          const metadata = await fetch(uri).then(res => res.json());
          
          return {
            tokenId: id.toString(),
            title: details.title,
            issueDate: details.issueDate,
            achievementType: details.achievementType,
            image: metadata.image,
            description: metadata.description
          };
        })
      );

      setUserCertificates(certificates);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setError('Không thể lấy danh sách certificates');
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  const value = {
    isLoading,
    error,
    userCertificates,
    mintCertificate,
    fetchUserCertificates
  };

  return (
    <NFTContext.Provider value={value}>
      {children}
    </NFTContext.Provider>
  );
}

export const useNFT = () => {
  const context = useContext(NFTContext);
  if (!context) {
    throw new Error('useNFT phải được sử dụng trong NFTProvider');
  }
  return context;
};