const main = async () => {
  const [owner] = await hre.ethers.getSigners();
  const web3WallContractFactory = await hre.ethers.getContractFactory('Web3Wall');
  const web3WallContract = await web3WallContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.05'),
  });
  await web3WallContract.deployed();

  console.log('Contract deployed to:', web3WallContract.address);
  console.log('Address of the contract owner:', owner.address);

  let contractBalance = await hre.ethers.provider.getBalance(web3WallContract.address);

  console.log('Contract balance:', hre.ethers.utils.formatEther(contractBalance));

  const createPostTxn = await web3WallContract.createPost('This is post #1');

  await createPostTxn.wait();

  const createPostTxn2 = await web3WallContract.createPost('This is post #2');

  await createPostTxn2.wait();

  contractBalance = await hre.ethers.provider.getBalance(web3WallContract.address);

  console.log('Contract balance:', hre.ethers.utils.formatEther(contractBalance));

  let allPosts = await web3WallContract.getAllPosts();

  console.log(allPosts);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);

    process.exit(1);
  });
