import { Contract, Signer } from 'ethers';
import type { ContractInterface } from '@ethersproject/contracts';

export default class ContractWrapper {
    contract: Contract | null;
    connectionError: string;

    constructor() {
        this.connectionError = "";
        this.contract = null;
    }

    async connect (signer: Signer, contractAddress: string, abi: ContractInterface) {
        try {
            this.contract = new Contract(contractAddress, abi, signer);
        } catch (err) {
            console.error("ContractWrapper::constructor() - Error Connecting to contract: ", err);
            this.connectionError = <string> err;
        }
        //console.log("ContractWrapper::connect() - signer, contract", signer, this.contract);
    }
}
