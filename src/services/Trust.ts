import { BigNumber } from '@ethersproject/bignumber'

type Account = string;

export const enum TrustType {
    REVOKABLE, 
    IRREVOKABLE,
    QTIP, 
    GRAT, 
    SPECIAL_NEEDS,
    SPENDTHRIFT,
};

export const TypeStrings: Array<string> = [
    "Revokable",
    "Irrevokable",
    "QTIP",
    "GRAT",
    "Special Needs",
    "Spendthrift",
];

// Trust 
export class Trust {
    public key: string;
    public name: string;
    public grantor: Account;
    public trustees: Account[];
    public beneficiaries: Account[];
    public etherAmount: BigNumber;
    public createdDate: BigNumber;
    public maturityDate: BigNumber;
    public trustType: TrustType; 

    constructor() {
        this.key = "";
        this.name = "";
        this.grantor = "";
        this.trustees = [""];
        this.beneficiaries = [""];
        this.etherAmount = BigNumber.from(0);
        this.createdDate = BigNumber.from(0);
        this.maturityDate = BigNumber.from(0);
        this.trustType = TrustType.REVOKABLE;
    }

}
