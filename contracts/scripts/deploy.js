const { ethers } = require("hardhat");

async function main() {
  const Counter = await ethers.getContractFactory("Counter");
  const counter = await Counter.deploy();
  await counter.waitForDeployment();
  const address = await counter.getAddress();
  console.log("Counter deployed to:", address);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});