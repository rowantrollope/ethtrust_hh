import { BigNumber } from '@ethersproject/bignumber'
import { ethers } from 'ethers';

type Account = string;

export enum TrustType {
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
    public _beneficiary: Account;
    public etherAmount: BigNumber;
    public createdDate: BigNumber;
    public maturityDate: BigNumber;
    public trustType: TrustType; 

    constructor(trust?: Trust) {
        this.key = trust && trust.key || "";
        this.name = trust && trust.name || "";
        this.grantor = trust && trust.grantor || "";
        this.trustees = trust && trust.trustees ? [... trust.trustees] : [];
        this._beneficiary = trust && trust.beneficiary || "";
        this.etherAmount = trust && trust.etherAmount || BigNumber.from(0);
        this.createdDate = trust && trust.createdDate || BigNumber.from(0);
        this.maturityDate = trust && trust.maturityDate || BigNumber.from(0);
        this.trustType = trust && trust.trustType || TrustType.REVOKABLE;
    }

    //
    // Methods
    //
    public clone(trust: Trust) {
        this.key = trust.key;
        this.name = trust.name;
        this.grantor = trust.grantor;
        this.trustees = [... trust.trustees];
        this.beneficiary = trust.beneficiary;
        this.etherAmount = trust.etherAmount;
        this.createdDate = trust.createdDate;
        this.maturityDate = trust.maturityDate;
        this.trustType = trust.trustType;
    }

    getTypeString = (): string => TypeStrings[this.trustType];
    
    public isValidBeneficiary(beneficiary: Account): { valid: boolean, reason: string } {
        let result = { valid: true, reason: ''};

        if(beneficiary === "")
            return result;            
        
        if(!ethers.utils.isAddress(beneficiary)) {
            result.valid = false;
            result.reason = "Invalid address";
        }

        if(beneficiary.toUpperCase() === this.grantor.toUpperCase()) {
            result.valid = false;
            result.reason = "Beneficiary cannot be the same as grantor.";
        }   

        let index = this.trustees!.findIndex(item => item.toUpperCase() === beneficiary.toUpperCase());
        
        if(index !== -1) {
            result.valid = false;
            result.reason = "Beneficiary cannot also be a trustee."
        }

        return result;
    }

    public set beneficiary(beneficiary: Account) {
        let result = this.isValidBeneficiary(beneficiary);
        
        //if(!result.valid)
            //throw result.reason;

        this._beneficiary = beneficiary;
    }

    public get beneficiary () {
        return this._beneficiary;
    }

    public setMaturityDate = (date: Date) => this.maturityDate = BigNumber.from(Math.floor(date.getTime() / 1000));
    public getMaturityDate = (): Date => new Date(this.maturityDate.toNumber() * 1000);

    public getCreatedDate = (): Date => new Date(this.createdDate.toNumber() * 1000);

    //
    // Validation rules!
    //
    public isValidTrustee(trustee: Account): { valid: boolean, reason: string } {
        
        let result = { valid: true, reason: '' };

        // Prevent duplicates
        let index = this.trustees!.findIndex(item => item.toUpperCase() === trustee.toUpperCase());

        if(index !== -1) {
            result.reason = "Trustee already exists."
            result.valid = false;
        }

        // MUST be a valid address
        if(!ethers.utils.isAddress(trustee)) {
            result.reason = "Invalid address."
            result.valid = false;
        }

        // Trustee cannot be the same as GRANTOR
        if(this.grantor.toUpperCase() === trustee.toUpperCase()) {
            result.reason = "Trustee cannot be the same as grantor."
            result.valid = false;
        }
        
        // Trustee cannot also be a beneficiary
        if(this.beneficiary.toUpperCase() === trustee.toUpperCase()) {
            result.reason = "Trustee cannot be the beneficiary."
            result.valid = false;
        }
        
        return result;
    }
    
    public addTrustee(trustee: Account) {
        let result = this.isValidTrustee(trustee);

        if(!result.valid)
            throw result.reason;

        this.trustees.push(trustee);
    }

    public removeTrustee(trustee: Account) {
        let index = this.trustees!.findIndex(item => item.toUpperCase() === trustee.toUpperCase())
        if(index !== -1) {
            this.trustees!.splice(index, 1);
        }
    }  
}
