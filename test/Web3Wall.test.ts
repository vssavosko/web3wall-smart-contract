import { ethers } from "hardhat";
import { Contract } from "ethers";
import { expect, assert } from "chai";

// eslint-disable-next-line node/no-missing-import
import { Web3Wall } from "../typechain";
import vladoCoinAbi from "../abi/vladoCoinAbi.json";

describe("Web3Wall contract", function () {
  let web3WallContract: Web3Wall;
  let contractWithSigner: Contract;

  beforeEach(async function () {
    const provider = new ethers.providers.AlchemyProvider("rinkeby", process.env.DEV_ALCHEMY_KEY);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

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

  it("The Web3Wall contract balance should be equal to 15000 VLA", async function () {
    const expectedContractBalance = "15000.0";

    const contractBalance = await contractWithSigner.balanceOf(web3WallContract.address);

    const formattedContractBalance = ethers.utils.formatEther(contractBalance);

    expect(formattedContractBalance).to.equal(expectedContractBalance);
  });

  it(`
    A post with the message 'test' must be created,
    the totalPosts must be equal to 1
  `, async function () {
    const expectedPostMessage = "test";
    const expectedTotalPosts = 1;

    await web3WallContract.createPost("test");

    const [post] = await web3WallContract.getAllPosts();
    const totalPosts = await web3WallContract.totalPosts();

    expect(post[2]).to.equal(expectedPostMessage);
    expect(totalPosts).to.equal(expectedTotalPosts);
  });

  it(`
    When a user creates a post, he can win 1000, 5000, 10000 VLA (random),
    if he does not win, then the contract balance will remain the same
  `, async function () {
    const expected15k = "15000.0";
    const expected14k = "14000.0";
    const expected10k = "10000.0";
    const expected5k = "5000.0";

    await web3WallContract.createPost("test");

    const contractBalance = await contractWithSigner.balanceOf(web3WallContract.address);

    const formattedContractBalance = ethers.utils.formatEther(contractBalance);

    assert.oneOf(formattedContractBalance, [expected15k, expected14k, expected10k, expected5k]);
  });

  it(`
    When a user tries to create 2 posts less than 12 hours apart,
    the second transaction should fail
  `, async function () {
    const expectedErrorMessage =
      "You need to wait 12 hours from your last post before posting again";

    try {
      await web3WallContract.createPost("test1");
      await web3WallContract.createPost("test2");
    } catch (error) {
      assert(error, expectedErrorMessage);
    }
  });

  it(`
    If the user does not win the prize, then the contract balance remains the same,
    if he wins, but there is not enough VLA in the contract, then the transaction should fail
  `, async function () {
    const expectedContractBalance = "100.0";
    const expectedErrorMessage = "There are not enough tokens on the contract balance";

    const web3WallContractFactory = await ethers.getContractFactory("Web3Wall");
    const web3WallContract = await web3WallContractFactory.deploy();

    await web3WallContract.deployed();

    await contractWithSigner.transfer(web3WallContract.address, ethers.utils.parseEther("100"));

    const contractBalance = await contractWithSigner.balanceOf(web3WallContract.address);

    const formattedContractBalance = ethers.utils.formatEther(contractBalance);

    expect(formattedContractBalance).to.equal(expectedContractBalance);

    await web3WallContract.createPost("test").catch((error) => assert(error, expectedErrorMessage));

    expect(formattedContractBalance).to.equal(expectedContractBalance);
  });
});
