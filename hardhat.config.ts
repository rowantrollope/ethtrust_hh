import { HardhatUserConfig } from 'hardhat/types';
import { } from 'hardhat-deploy';
import { } from 'hardhat-deploy-ethers';

import {} from 'dotenv/config';
import { node_url, accounts } from './utils/network';
import { task } from 'hardhat/config';

task("accounts", "Show all Hardhat accounts").setAction(async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log("Account: " + await account.address + " Balance: " + await account.getBalance());
        console.log("Private Key: " + "");

    }
});

const config: HardhatUserConfig = {
    solidity: {
        version: '0.8.4',
    },
    networks: {
        mainnet: {
            url: node_url('mainnet'),
            accounts: accounts('mainnet'),
        },
        rinkeby: {
            url: node_url('rinkeby'),
            accounts: accounts('rinkeby'),
        },
        hardhat: {
            chainId: 1337,
            accounts: {
                count: 20
            },
            mining: {
                auto: true,
            }
        }
    },  
    namedAccounts: {
        deployer: {
            default: 0, 
            1: 'privatekey://cbe8457ebb2c9425ea9213a816010e3935f07dd794d08d8c07cca0d6f5c8db50', // mainnet deployer
            4: 'privatekey://cbe8457ebb2c9425ea9213a816010e3935f07dd794d08d8c07cca0d6f5c8db50', // rinkeby
        },
        trustCreator: 3,
        trustBeneficiary: 1,
    },
    paths: {
        sources: 'src',
    },
}

export default config;
