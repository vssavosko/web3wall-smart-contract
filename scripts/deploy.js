const main = async () => {
  const web3WallContractFactory = await hre.ethers.getContractFactory('Web3Wall');
  const web3WallContract = await web3WallContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.001'),
  });

  await web3WallContract.deployed();

  console.log('Web3Wall contract address: ', web3WallContract.address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);

    process.exit(1);
  });
