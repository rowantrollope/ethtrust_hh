import { ethers, Signer } from 'ethers';
import { BigNumber} from "@ethersproject/bignumber";
import { Listener } from "@ethersproject/abstract-provider";
import ContractWrapper from "./ContractWrapper"

import Trust  from "./Trust";
import Trusts from '../../deployments/localhost/Trusts.json';
import { assert } from 'chai';

export default class TrustContract extends ContractWrapper {

    constructor(signer: Signer) {
        super(signer, Trusts.address, Trusts.abi);
        
        assert(this.contract !== null);

        this.contract!.on("LogCreateTrust", this.onCreate)
    }

    onCreate: Listener = (...args: Array<any>): void => {
        console.log("TrustContract::onCreate Sender: ", args[0]);
        console.log("TrustContract::onCreate Key: ", args[1]);
        console.log("TrustContract::onCreate Name: ", args[2]);
    }
    /**
     * getTrustCount
     * 
     * @param dest the destination account
     * @param amount the number of token to send
     */
    async getTrustCount (): Promise <number> {

        if(this.contract === null)
            return -1;

        const count: BigNumber = await this.contract.getTrustCount();

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
        
        if(this.contract === null)
            return -1;    
 
        console.log(`CreateTrust: Beneficiary: ${address} Amount: ${amount}, Account: ${account}, Date: ${date}`);
        
        const overflow = {
            value: amount.toString(),
        }
        
        await this.contract.createTrust(address, trustee, name, date, overflow);
    
    }

    /**
     * getTrustAtIndex 
     * 
     * @param index the Trust to read
     * @returns the KEY of the trust at index
     */
    async getTrustAtIndex(index: Number): Promise <string> {
        if(this.contract === null)
            return '';

        const key = await this.contract.getTrustAtIndex(index);
        return key;
    }
    /**
     * 
     * @param key trust to read
     * @returns Promise to a Trust Object
     */
    async getTrust(key: string): Promise<Trust> {
        
        if(this.contract === null)
            return null;
    
        const trust: Trust = await this.contract.getTrust(key);
    
        return trust;
    }
    /**
     * deleteTrust
     * 
     * @param key key of trust to delete
     * @returns 
     */
    async deleteTrust(key: string) {
        if(this.contract === null)
            return;

        await this.contract.withdrawAll(key);
        await this.contract.deleteTrust(key);
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
        if(this.contract === null)
            return;
    
        console.log(`UpdateTrust ${key}: Name: ${name}, Date: ${date}, Beneficiary: ${beneficiary}, Account: ${account}`);
        
        await this.contract.updateTrust(key, beneficiary, trustee, name, date);
        
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
        if(this.contract === null)
            return;
            
        console.log(`withdraw() ${key}: ${amount}, Account: ${account}`);
       
        await this.contract.withdraw(key, amount);

        //await _updateTrust(key);
    }
    
    async deposit(key: string, amount: number, account: string) {
        if(this.contract === null)
            return;
    
        console.log(`deposit() ${key}: ${amount}, Account: ${account}`);
    
        const overflow = {
            value: amount.toString(),
        }
        await this.contract.depositTrust(key, overflow);
        
        //await _updateTrust(key);
    }
    
}


/*

    state.trustCount = await trustContract.methods.getTrustCount().call();
    console.log(`TrustContract.load() - SUCCESS Loading. getTrustCount: ${state.trustCount}`);
    // Load trusts
    for (var i = 0; i <= state.trustCount - 1; i++) {
        const key = await trustContract.methods.getTrustAtIndex(i).call();
        const trust = await trustContract.methods.getTrust(key).call(); 
        if(!callback || callback(trust))
            newtrusts = [...newtrusts, trust];
    }
    */