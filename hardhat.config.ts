import {HardhatUserConfig} from 'hardhat/types';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import {node_url, accounts} from './utils/network';

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