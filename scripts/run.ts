import { Contract } from "ethers";
import { ethers } from "hardhat";

import vladoCoinAbi from "../abi/vladoCoinAbi.json";

const checkAccountBalance = async (contractWithSigner: Contract, contractAddress: string) => {
  const contractBalance = await contractWithSigner.balanceOf(contractAddress);

  console.log("Contract balance:", ethers.utils.formatEther(contractBalance));
};

const main = async () => {
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, ethers.provider);
  const web3WallContractFactory = await ethers.getContractFactory("Web3Wall");
  const web3WallContract = await web3WallContractFactory.deploy();

  await web3WallContract.deployed();

  console.log("Web3Wall deployed to:", web3WallContract.address);

  const vladoCoinContract = new ethers.Contract(
    process.env.VLADO_COIN_CONTRACT_ADDRESS!,
    vladoCoinAbi,
    signer,
  );

  const contractWithSigner = vladoCoinContract.connect(signer);

  await contractWithSigner.transfer(web3WallContract.address, ethers.utils.parseEther("15000"));

  await checkAccountBalance(contractWithSigner, web3WallContract.address);

  const createPostTxn = await web3WallContract.createPost("This is post #1");

  await createPostTxn.wait();

  await checkAccountBalance(contractWithSigner, web3WallContract.address);

  const allPosts = await web3WallContract.getAllPosts();

  console.log(allPosts);
};

main().catch((error) => {
  console.error(error);

  process.exitCode = 1;
});
