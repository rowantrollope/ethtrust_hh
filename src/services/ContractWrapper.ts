import { Contract, Signer } from 'ethers';
import type { ContractInterface } from '@ethersproject/contracts';

export default class ContractWrapper {
    contract: Contract | null;
    connectionError: string;

    constructor(signer: Signer, contractAddress: string, abi: ContractInterface) {
        this.connectionError = "";
        this.contract = null;
        
        try {
            this.contract = new Contract(contractAddress, abi, signer);
        } catch (err) {
            console.error("ContractWrapper::constructor() - Error Connecting to contract: ", err);
            this.connectionError = err;
        }
        console.log("ContractWrapper::connect() - signer, contract", signer, this.contract);
    }

}
