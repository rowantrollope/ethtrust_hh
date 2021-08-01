import {HardhatUserConfig} from 'hardhat/types';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import {node_url, accounts} from './test/utils/network';
import { task } from 'hardhat/config';
import { hexStripZeros } from '@ethersproject/bytes';

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
        rinkeby: {
            url: node_url('rinkeby'),
            accounts: accounts('rinkeby1'),
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
        deployer: 0,
        trustCreator: 0,
        trustBeneficiary: 1,
        tokenOwner: 1,
    },
    paths: {
        sources: 'src',
    },
};

export default config;