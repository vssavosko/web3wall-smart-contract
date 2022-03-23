const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();

  const wallContractFactory = await hre.ethers.getContractFactory('Wall');
  const wallContract = await wallContractFactory.deploy();
  await wallContract.deployed();

  console.log('Contract deployed to:', wallContract.address);
  console.log('Contract deployed by:', owner.address);

  let postCount;

  postCount = await wallContract.getTotalPosts();

  let postTxn = await wallContract.post();

  await postTxn.wait();

  postCount = await wallContract.getTotalPosts();

  postTxn = await wallContract.connect(randomPerson).post();

  await postTxn.wait();

  postCount = await wallContract.getTotalPosts();
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
