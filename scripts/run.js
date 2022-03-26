const main = async () => {
  const wallContractFactory = await hre.ethers.getContractFactory('Wall');
  const wallContract = await wallContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.05'),
  });
  await wallContract.deployed();

  console.log('Contract deployed to:', wallContract.address);

  let contractBalance = await hre.ethers.provider.getBalance(wallContract.address);

  console.log('Contract balance:', hre.ethers.utils.formatEther(contractBalance));

  let postTxn = await wallContract.post('A message!');

  await postTxn.wait();

  contractBalance = await hre.ethers.provider.getBalance(wallContract.address);

  console.log('Contract balance:', hre.ethers.utils.formatEther(contractBalance));

  let allPosts = await wallContract.getAllPosts();

  console.log(allPosts);
};

(async () => {
  try {
    await main();

    process.exit(0);
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
})();
