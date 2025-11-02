import { ethers } from 'ethers';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CertificateNFTABI = JSON.parse(
    await readFile(
        join(__dirname, 'abis', 'CertificateNFT.json'),
        'utf8'
    )
).abi;

class CertificateService {
    constructor(provider, contractAddress) {
        this.provider = provider;
        this.contract = new ethers.Contract(contractAddress, CertificateNFTABI, provider);
    }

    async getCertificateDetails(tokenId) {
        try {
            return await this.contract.getCertificateDetails(tokenId);
        } catch (error) {
            console.error('Error getting certificate details:', error);
            throw error;
        }
    }

    async getCertificatesByOwner(owner) {
        try {
            return await this.contract.getCertificatesByOwner(owner);
        } catch (error) {
            console.error('Error getting certificates by owner:', error);
            throw error;
        }
    }

    async mintCertificate(to, title, achievementType, uri) {
        try {
            const tx = await this.contract.mintCertificate(to, title, achievementType, uri);
            const receipt = await tx.wait();
            const event = receipt.logs[0];
            return event.args.tokenId;
        } catch (error) {
            console.error('Error minting certificate:', error);
            throw error;
        }
    }
}

export default CertificateService;