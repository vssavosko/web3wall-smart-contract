import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

import { HardhatUserConfig } from "hardhat/config";

import * as dotenv from "dotenv";

dotenv.config();

const rinkebyNetworkUrl = `https://eth-rinkeby.alchemyapi.io/v2/${process.env.DEV_ALCHEMY_KEY}`;
const accounts = process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [];

const config: HardhatUserConfig = {
  solidity: "0.8.0",
  networks: {
    hardhat: {
      blockGasLimit: 3000000,
      forking: {
        url: rinkebyNetworkUrl,
      },
    },
    mainnet: {
      chainId: 1,
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.PROD_ALCHEMY_KEY}`,
      accounts,
    },
    rinkeby: {
      url: rinkebyNetworkUrl,
      accounts,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
