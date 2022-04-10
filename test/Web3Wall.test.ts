import { ethers } from "hardhat";
import { Contract } from "ethers";
import { expect, assert } from "chai";

// eslint-disable-next-line node/no-missing-import
import { Web3Wall } from "../typechain";
import vladoCoinAbi from "../abi/vladoCoinAbi.json";

describe("Web3Wall contract", function () {
  let web3WallContract: Web3Wall;
  let contractWithSigner: Contract;

  beforeEach(async () => {
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, ethers.provider);

    const web3WallContractFactory = await ethers.getContractFactory("Web3Wall");

    web3WallContract = await web3WallContractFactory.deploy();

    await web3WallContract.deployed();

    const vladoCoinContract = new ethers.Contract(
      process.env.VLADO_COIN_CONTRACT_ADDRESS!,
      vladoCoinAbi,
      signer,
    );

    contractWithSigner = vladoCoinContract.connect(signer);

    await contractWithSigner.transfer(web3WallContract.address, ethers.utils.parseEther("15000"));
  });

  it("test 1", async function () {
    const expected = "15000.0";

    const contractBalance = await contractWithSigner.balanceOf(web3WallContract.address);

    const formattedValue = ethers.utils.formatEther(contractBalance);

    expect(formattedValue).to.equal(expected);
  });

  it("test 2", async function () {
    const expectedTotal = "test";
    const expectedMessage = "test";

    await web3WallContract.createPost("test");

    const [firstPost] = await web3WallContract.getAllPosts();
    const totalPosts = await web3WallContract.totalPosts();

    expect(totalPosts).to.equal(expectedTotal);
    expect(firstPost[2]).to.equal(expectedMessage);
  });

  it("test 3", async function () {
    const expected = "You need to wait 12 hours from your last post before posting again";

    try {
      await web3WallContract.createPost("test1");
      await web3WallContract.createPost("test2");
    } catch (error) {
      assert(error, expected);
    }
  });
});
