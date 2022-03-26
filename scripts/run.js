const main = async () => {
  const wallContractFactory = await hre.ethers.getContractFactory('Wall');
  const wallContract = await wallContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.05'),
  });
  await wallContract.deployed();

  console.log('Contract deployed to:', wallContract.address);

  let contractBalance = await hre.ethers.provider.getBalance(wallContract.address);

  console.log('Contract balance:', hre.ethers.utils.formatEther(contractBalance));

  const postTxn = await wallContract.post('This is post #1');

  await postTxn.wait();

  const postTxn2 = await wallContract.post('This is post #2');

  await postTxn2.wait();

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
