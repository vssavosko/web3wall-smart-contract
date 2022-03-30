import { ethers } from "hardhat";

const main = async () => {
  const [signer] = await ethers.getSigners();
  const web3WallContractFactory = await ethers.getContractFactory("Web3Wall");
  const web3WallContract = await web3WallContractFactory.deploy({
    value: ethers.utils.parseEther("0.05"), // TODO: check how to deploy with VLA
  });

  await web3WallContract.deployed();

  console.log("Web3Wall deployed to:", web3WallContract.address);
  console.log("Address of the contract signer:", signer.address);

  let contractBalance = await ethers.provider.getBalance(web3WallContract.address);

  console.log("Contract balance:", ethers.utils.formatEther(contractBalance));

  const createPostTxn = await web3WallContract.createPost("This is post #1");

  await createPostTxn.wait();

  const createPostTxn2 = await web3WallContract.createPost("This is post #2");

  await createPostTxn2.wait();

  contractBalance = await ethers.provider.getBalance(web3WallContract.address);

  console.log("Contract balance:", ethers.utils.formatEther(contractBalance));

  const allPosts = await web3WallContract.getAllPosts();

  console.log(allPosts);
};

main().catch((error) => {
  console.error(error);

  process.exitCode = 1;
});
