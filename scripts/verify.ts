import { run } from "hardhat";

const main = async () => {
  await run("verify:verify", {
    address: process.env.DEPLOYED_CONTRACT_ADDRESS,
    contract: "contracts/Web3Wall.sol:Web3Wall",
  });
};

main().catch((error) => {
  console.error(error);

  process.exitCode = 1;
});
