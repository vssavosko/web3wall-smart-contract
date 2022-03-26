const main = async () => {
  const wallContractFactory = await hre.ethers.getContractFactory('Wall');
  const wallContract = await wallContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.001'),
  });

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
