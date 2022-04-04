import { ethers } from "hardhat";

const main = async () => {
  const web3WallContractFactory = await ethers.getContractFactory("Web3Wall");
  const web3WallContract = await web3WallContractFactory.deploy();

  await web3WallContract.deployed();

  console.log("Web3Wall deployed to:", web3WallContract.address);
};

main().catch((error) => {
  console.error(error);

  process.exitCode = 1;
});
