import { ethers } from 'ethers';
import { BigNumber } from '@ethersproject/bignumber'

type Account = string;

// Trust 
export default class Trust {
    public key: string;
    public name: string;
    public beneficiary: Account;
    public trustee: Account;
    public etherAmount: BigNumber;
    public creator: Account;
    public createdDate: BigNumber;
    public maturityDate: BigNumber;

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
