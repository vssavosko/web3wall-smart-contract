const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log('Deploying contracts with account: ', deployer.address);
  console.log('Account balance: ', accountBalance.toString());

  const wallContractFactory = await hre.ethers.getContractFactory('Wall');
  const wallContract = await wallContractFactory.deploy();
  await wallContract.deployed();

  console.log('Wall contract address: ', wallContract.address);
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
