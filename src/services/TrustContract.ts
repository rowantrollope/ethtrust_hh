import { ethers, Signer } from 'ethers';
import { BigNumber} from "@ethersproject/bignumber";
import { Listener } from "@ethersproject/abstract-provider";
import ContractWrapper from "./ContractWrapper"

import Trust  from "./Trust";
import Trusts from '../../deployments/localhost/Trusts.json';

export const enum ChangeType {
    TRUST_CREATED,
    TRUST_DELETED,
    TRUST_UPDATED,
};

export interface ChangeCallback { (key: string, change: ChangeType): void }
export interface FilterCallback { (trust: Trust): boolean }

export class TrustContract extends ContractWrapper {
    private onChange: ChangeCallback|null;

    constructor(signer: Signer) {
        super(signer, Trusts.address, Trusts.abi);

        this.onChange = null;
        
        if(!this.contract) {
            console.error("Trustcontract::TrustContract Error - this.contract failed");
            return;
        }
        var filter = this.contract!.filters.LogCreateTrust();
        
        this.contract!.removeAllListeners();
        this.contract!.on("LogCreateTrust", this.onCreate)
        this.contract!.on("LogRemoveTrust", this.onRemove)
        this.contract!.on("LogUpdateTrust", this.onUpdate)

    }
    /**
     * Sets the callback to be used when there are changes
     * @param _onChange changeCallback
     */
     setOnChange(_onChange: ChangeCallback) {
        this.onChange = _onChange;
    }    
    
    onCreate: Listener = (...args: Array<any>): void => {
        console.log("TrustContract::onCreate Key: ", args[1]);
        if(this.onChange) {
            this.onChange(args[1], ChangeType.TRUST_CREATED);
        }
        return;
    }
    onRemove: Listener = (...args: Array<any>): void => {
        console.log("TrustContract::onRemove Key: ", args[1]);
        if(this.onChange) {
            this.onChange(args[1], ChangeType.TRUST_DELETED);
        }
    }
    onUpdate: Listener = (...args: Array<any>): void => {
        console.log("TrustContract::onUpdate Key: ", args[1]);
        if(this.onChange) {
            this.onChange(args[1], ChangeType.TRUST_UPDATED);
        }
    }

    /**
     * 
     * @param callback Filter which trusts to include
     * @returns array of trusts
     */
    async getTrusts (callback: FilterCallback): Promise<Array<Trust>> {

        let newtrusts: Array<Trust> = [];
    
        const count = await this.getTrustCount();

        // Load trusts       
        for (var i = 0; i <= count - 1; i++) {
            const key = await this.getTrustAtIndex(i);
            const trust = await this.getTrust(key);
            if(!callback || callback(trust))
                newtrusts = [...newtrusts, trust];
        }
    
        return newtrusts;
    }
    /**
     * getTrustCount
     * 
     * @param dest the destination account
     * @param amount the number of token to send
     */
    async getTrustCount (): Promise <number> {

        const count: BigNumber = await this.contract!.getTrustCount();

        console.log(`TrustContract::getTrustCount() - ${count} trusts`);

        return count.toNumber();

    } 
    /**
     * 
     * @param address Beneficiary account address
     * @param trustee Trustee account address
     * @param name Friendly Name (Not required)
     * @param date Maturity Date
     * @param amount Amount
     * @param account From
     * @returns 
     */
    async createTrust(address: string, trustee: string, name: string, date: number, amount: BigNumber, account: string) {
 
        console.log(`CreateTrust: Beneficiary: ${address} Amount: ${amount}, Account: ${account}, Date: ${date}`);
        
        const overflow = { value: amount.toString(), }
        
        await this.contract!.createTrust(address, trustee, name, date, overflow);
    
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
   
        return await this.contract!.getTrust(key);
    }
    /**
     * deleteTrust
     * 
     * @param key key of trust to delete
     * @returns 
     */
    async deleteTrust(key: string) {

        await this.contract!.withdrawAll(key);
        await this.contract!.deleteTrust(key);
    }
    
    /**
     * updateTrust
     * 
     * @param key trust to update
     * @param beneficiary new beneficiary
     * @param trustee new trustee
     * @param name new name
     * @param date new maturity Date
     * @param account creator
     * @returns nada
     */
    async updateTrust(key: string, beneficiary: string, trustee: string, name: string, date: number, account: string) {

        console.log(`UpdateTrust ${key}: Name: ${name}, Date: ${date}, Beneficiary: ${beneficiary}, Account: ${account}`);
        
        await this.contract!.updateTrust(key, beneficiary, trustee, name, date);
        
        //await _updateTrust(key);
    }
    /*
    const _updateTrust = async (key) => {
    
        let index = state.trusts.findIndex(trust => trust.key === key);
    
        let newTrust = await trustContract.methods.getTrust(key).call();
        
        state.trusts[index] = newTrust;
    }
    */
    async withdraw(key: string, amount: number, account: string) {

        console.log(`withdraw() ${key}: ${amount}, Account: ${account}`);
       
        await this.contract!.withdraw(key, amount);

        //await _updateTrust(key);
    }
    
    async deposit(key: string, amount: number, account: string) {

        console.log(`deposit() ${key}: ${amount}, Account: ${account}`);
    
        const overflow = {
            value: amount.toString(),
        }
        await this.contract!.depositTrust(key, overflow);
        
        //await _updateTrust(key);
    }
    
}

