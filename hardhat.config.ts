import {HardhatUserConfig} from 'hardhat/types';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';

import 'dotenv/config';
import {node_url, accounts} from './utils/network';
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
        rinkeby: {
            url: node_url('rinkeby'),
            accounts: accounts('rinkeby'),
            //accounts: ['0xd560951bb76c8b3e974a10d409ac0debef83743e3eeb220663b1e3f39d428d76'],
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
            4: 'privatekey://0xd560951bb76c8b3e974a10d409ac0debef83743e3eeb220663b1e3f39d428d76', // rinkeby
        },
        trustCreator: 3,
        trustBeneficiary: 1,
    },
    paths: {
        sources: 'src',
    },
};

export default config;
