const hre = require("hardhat");

async function main() {
  try {
    console.log("Deploying CertificateNFT contract...");

    // Get the contract factory
    const CertificateNFT = await hre.ethers.getContractFactory("CertificateNFT");
    
    // Deploy the contract
    const certificateNFT = await CertificateNFT.deploy();
    
    // Wait for deployment transaction to be mined
    await certificateNFT.waitForDeployment();

    // Get the deployed contract address
    const address = await certificateNFT.getAddress();
    
    console.log("CertificateNFT deployed to:", address);
    return address;
  } catch (error) {
    console.error("Error deploying contract:", error);
    throw error;
  }
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });