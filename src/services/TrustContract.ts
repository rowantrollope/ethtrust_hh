import { Signer } from 'ethers';
import { BigNumber} from "@ethersproject/bignumber";
import ContractWrapper from "./ContractWrapper"

import { Trust }  from "./Trust";
import Trusts from '../../deployments/localhost/Trusts.json';

/**
 * Emitted by ChangeCallback
 */
export const enum ChangeType {
    TRUST_CREATED,
    TRUST_DELETED,
    TRUST_UPDATED,
    TRUST_WITHDRAW,
    TRUST_DEPOSIT,
};

export interface ChangeCallback { (key: string, change: ChangeType): void }
export interface FilterCallback { (trust: Trust): boolean }

export class TrustContract extends ContractWrapper {
    
    private onChange: ChangeCallback|null;

    constructor() {
        super();
        this.onChange = null;
    }

    /**
     * 
     * @param signer Signer used for connection
     * @returns void
     */
    async connect(signer: Signer) {

        await super.connect(signer, Trusts.address, Trusts.abi);
        
        //console.log("TrustContract::connect()");

        this.onChange = null;
        
        if(!this.contract) {
            console.error("Trustcontract::connect Error - this.contract failed");
            return;
        }
        
        this.contract!.removeAllListeners();
        
        this.contract!.on("LogCreateTrust", 
            (...args: Array<any>): void => {
                if(this.onChange) this.onChange(args[1], ChangeType.TRUST_CREATED);
            });
        
        this.contract!.on("LogRemoveTrust", 
            (...args: Array<any>): void => {
                if(this.onChange) this.onChange(args[1], ChangeType.TRUST_DELETED);
            });

        this.contract!.on("LogUpdateTrust", 
            (...args: Array<any>): void => { console.log("updateTrust");
                if(this.onChange) this.onChange(args[1], ChangeType.TRUST_UPDATED);
            });

        this.contract!.on("LogWithdrawTrust", 
            (...args: Array<any>): void => {
                if(this.onChange) this.onChange(args[1], ChangeType.TRUST_WITHDRAW);
            });
    
        this.contract!.on("LogDepositTrust", 
            (...args: Array<any>): void => {
                if(this.onChange) this.onChange(args[1], ChangeType.TRUST_DEPOSIT);
            });
  
    }

    /**
     * Sets the callback to be used when there are changes
     * @param _onChange changeCallback
     */
     setOnChange(_onChange: ChangeCallback) {
        this.onChange = _onChange;
    }    
    
    /**
     * 
     * @param callback Filter which trusts to include
     * @returns array of trusts
     */
    async getTrusts (callback: FilterCallback): Promise<Array<Trust>> {

        let newTrusts: Array<Trust> = [];
    
        const count = await this.getTrustCount();

        // Load trusts       
        for (var i = 0; i <= count - 1; i++) {
            const key = await this.getTrustAtIndex(i);
            const trust = await this.getTrust(key);
            if(!callback || callback(trust)) {
                newTrusts.push(trust)
            }
        }

        return newTrusts;
    }

    /**
     * getTrustCount
     * 
     * @param dest the destination account
     * @param amount the number of token to send
     */
    async getTrustCount (): Promise <number> {

        const count: BigNumber = await this.contract!.getTrustCount();

        //console.log(`TrustContract::getTrustCount() - ${count} trusts`);

        return count.toNumber();

    } 

    /**
     * Create a new Trust
     * @param trust new Trust
     * @returns void
     */
    async createTrust(trust: Trust) {
 
        console.log(`CreateTrust: Beneficiary: ${trust.beneficiary}, trustee: ${trust.trustees}, Amount: ${trust.etherAmount.toString()}, Grantor: ${trust.grantor}, Date: ${trust.maturityDate}`);
        
        const overflow = { value: trust.etherAmount.toString(), }
        
        await this.contract!.createTrust(trust.beneficiary, trust.trustees, trust.name, trust.maturityDate, trust.trustType, overflow);

    }

    /**
     * getTrustAtIndex 
     * @param index the Trust to read
     * @returns the KEY of the trust at index
     */
    async getTrustAtIndex(index: Number): Promise <string> {

        const key = await this.contract!.getTrustAtIndex(index);
        return key;
    }

    /**
     * 
     * @param key trust to read
     * @returns Promise to a Trust Object
     */
    async getTrust(key: string): Promise<Trust> {
   
        return new Trust(await this.contract!.getTrust(key));
    }

    /**
     * deleteTrust
     * 
     * @param key key of trust to delete
     * @returns 
     */
    async deleteTrust(key: string): Promise<boolean> {
        // Validate balance is 0 first
        let trust: Trust = await this.contract!.getTrust(key);

        if(trust.etherAmount.toNumber() != 0) {
            console.error("TrustContract::deleteTrust() - Can't delete a trust with > 0 etherBalance, withdraw first");
            return false;
        }

        await this.contract!.deleteTrust(key);
        return true;
    }
    
    /**
     * updateTrust
     * 
     * @param key trust to update
     * @param beneficiary new beneficiary
     * @param trustee new trustee
     * @param name new name
     * @param maturityDate new maturity Date
     * @returns nada
     */
    async updateTrust(trust: Trust) {

        console.log(`UpdateTrust ${trust.key}: Name: ${trust.name}, maturityDate: ${trust.maturityDate}, Beneficiary: ${trust.beneficiary}`);
        
        await this.contract!.updateTrust(trust.key, trust.beneficiary, trust.trustees, trust.name, trust.maturityDate);
    }
    
    /**
     * 
     * @param key key of updated trust
     */
    async _updateTrust(key: string) {
        if(this.onChange)
            this.onChange(key, ChangeType.TRUST_UPDATED);
    }

    /**
     * 
     * @param key trust to withdraw
     * @param amount amount to withdraw
     * @returns whether withdrawal was successful
     */
    async withdraw(key: string, amount: BigNumber): Promise<boolean> {

        console.log(`withdraw() ${key}: ${amount.toString()}`);

        try {
            await this.contract!.withdraw(key, amount);
            console.log("TrustContract::withdraw() - Success")  
            return true;          
        }
        catch(error) {
            if(error) {
                console.log("TrustContract::withdraw failed with: ", error.data.message);
            }
            return false;
        }
    }

    /**
     * 
     * @param key trust to check
     * @param account account to withdraw to
     * @returns bool: can withdraw reason: why
     */
    async canWithdraw(key: string, account: string): Promise<{ result: boolean, reason: string }> {
        return await this.contract!.canWithdraw(key, account)
    }

    /**
     * 
     * @param key trust to withdraw
     * @returns success or failure on withdraw
     */
    async withdrawAll(key: string): Promise<boolean> {

        console.log(`withdraw() ${key}`);

        try {
            await this.contract!.withdrawAll(key);    
            console.log("TrustContract::withdrawAll() - Success")
            return true;            
        }
        catch(error) {

            if(error) {
                console.error("TrustContract::withdrawAll failed with: ", error.data.message);
            }
            return false;
        }
    }

    /**
     * 
     * @param key trust to deposit to
     * @param amount amount to deposit
     */
    async deposit(key: string, amount: BigNumber) {

        console.log(`deposit() ${key}: ${amount.toString()}`);
    
        const overflow = {
            value: amount.toString(),
        }
        await this.contract!.depositTrust(key, overflow);
    }
    
}

