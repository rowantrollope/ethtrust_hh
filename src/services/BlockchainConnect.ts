
import { ref, Ref } from 'vue';
import { ethers, Signer } from 'ethers';
import type {Provider} from '@ethersproject/abstract-provider';
import { BigNumber } from '@ethersproject/bignumber'
import detectEthereumProvider from "@metamask/detect-provider";
import { toEtherStringRounded } from './Helpers';

interface changeCallback { (myArgument: string): void }

export default class BlockchainConnect {
    public provider: Provider|null;
    public signer: Signer|null;
    
    private _onChange: changeCallback|null;

    // Reactive members
    public account: Ref<string>;
    public loaded: Ref<boolean>;
    public connectionError: Ref<string>;

    constructor() {
        this.provider = null;
        this.signer = null;
        this._onChange = null;
        this.loaded = ref(false);
        this.account = ref("");
        this.connectionError = ref("");
    }

    async connect(): Promise<void> {
        // Connect MetaMask
        this.provider = <Provider> await detectEthereumProvider();

        if(this.provider) {
            // Connect Ethers to Metamask instance
            this.provider = new ethers.providers.Web3Provider((window.ethereum as ethers.providers.ExternalProvider))

            await (this.provider as ethers.providers.Web3Provider).send("eth_requestAccounts", []);
            
            this.signer = (this.provider as ethers.providers.Web3Provider).getSigner();

            if(this.signer === null || this.signer === undefined)
            {
                console.error("BlockchainConnect::connect() Signer returned null")
                return;
            }
        
        } else {
            this.provider = <Provider> ethers.providers.getDefaultProvider();
            this.signer = (this.provider as ethers.providers.Web3Provider).getSigner();
        }

        this.account.value = await this.signer!.getAddress();
        this.loaded.value = true;

        //console.log("BlockchainConnect::connect() - Complete: ", this.provider, this.signer, this.account);
    
        //
        // Setup change notification
        //
        // TODO: Figure out why I can't call this by passing func reference... odd
        (window.ethereum as Provider).on('accountsChanged', (accounts: Array<string>) => {
            this.accountsChanged(accounts);
        });
    }

    /**
     * Callback handler for when user changes accounts
     * 
     * @param accounts list of accounts - currently MetaMask only sets account[0]
     */
    accountsChanged(accounts: Array<string>) {

        if(accounts.length) {
            this.account.value = accounts[0];
            console.log("BlockchainConnect::accountsChanged()", this.account.value);
        } 
        else if (accounts.length === 0) {
            console.log('BlockchainConnect::accountsChanged() - Please connect to MetaMask.');
            this.account.value = "";    
        }

        // call user supplied change notification callback
        if(this._onChange != null) {
            console.log(this.account.value);
            this._onChange(this.account.value); 
        }
        
    }
    
    /**
     * Sets the callback to be used when the account changes
     * @param _onChange changeCallback
     */
    setOnChange(onChange: changeCallback) {
        this._onChange = onChange;
    }    
    
    /**
     * Gets the ETHER balance of an account 
     * @param address Account to get balance for
     * @returns promise to the balance in WEI - a string
     */
    async getBalance() : Promise<BigNumber> {
        if(this.provider) {
            return await this.provider.getBalance(this.account.value);
        } else {
            console.error("BlockchainConnect::balanceOf() - not loaded yet - call connect first")
            return BigNumber.from(0);
        }
    }
    /**
     * Helper to return balance formatted as Ether
     * @param address Account address to get balance for
     * @param precision Number of decimal places of precision. Default (-1) returns the full number
     * @returns promise to the balance in ETHER - a string
     */
    async getBalanceString(precision: number = 2 ) : Promise<string> {
        const weiBal = await this.getBalance();
        return toEtherStringRounded(weiBal, precision);
    }

}
