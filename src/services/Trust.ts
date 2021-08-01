import { BigNumber } from '@ethersproject/bignumber'

type Account = string;

// Trust 
export default class Trust {
    key: string;
    name: string;
    beneficiary: Account;
    trustee: Account;
    etherAmount: BigNumber;
    creator: Account;
    createdDate: BigNumber;
    maturityDate: BigNumber;

    constructor() {
        this.key = "";
        this.name = "";
        this.beneficiary = "";
        this.trustee = "";
        this.etherAmount = BigNumber.from(0);
        this.creator = "";
        this.createdDate = BigNumber.from(0);
        this.maturityDate = BigNumber.from(0);
    }    
}
