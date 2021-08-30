
import { ref, Ref } from 'vue';
import { ethers, Signer } from 'ethers';
import type {Provider} from '@ethersproject/abstract-provider';
import { BigNumber } from '@ethersproject/bignumber'
import detectEthereumProvider from "@metamask/detect-provider";
import * as utils from './Utils';

interface changeCallback { (myArgument: string): void }

export enum ConnectionState {
    Unknown = 0,
    NotConnected,
    Connecting,
    Connected,
    Error,
};

export class BlockchainConnect {
    public provider: Provider|null;
    public signer: Signer|null;
    public chainId: number;
    public chainName: string;
    private _onChange: changeCallback|null;

    // Reactive members
    public account: Ref<string>;
    public connectionState: Ref<ConnectionState>;
    public connectionError: Ref<string>;

    constructor() {
        this.provider = null;
        this.signer = null;
        this._onChange = null;
        this.chainId = 0;
        this.chainName = "";

        this.connectionState = ref(ConnectionState.Unknown);
        this.connectionError = ref("");
        this.account = ref("");
    }

    async connect(): Promise<void> {
        try {
            this.connectionState.value = ConnectionState.Connecting;

            // Connect MetaMask
            this.provider = <Provider> await detectEthereumProvider();
            //console.log("detectEthereumProvider(): ", this.provider);
            
            if(this.provider) {
                // Connect Ethers to Metamask instance
                this.provider = new ethers.providers.Web3Provider((window.ethereum as ethers.providers.ExternalProvider))
    
                await (this.provider as ethers.providers.Web3Provider).send("eth_requestAccounts", []);
                
                this.signer = (this.provider as ethers.providers.Web3Provider).getSigner();
    
                if(this.signer === null || this.signer === undefined)
                {
                    this.connectionState.value = ConnectionState.Error;
                    this.connectionError.value = "BlockchainConnect::connect() Signer returned null";
                    console.error(this.connectionError.value);
                    return;
                }
            
            } else {
                console.log("METAMASK not loaded, calling getDefaultProvider()");

                this.provider = <Provider> ethers.providers.getDefaultProvider();

                if(!this.provider) {
                    this.connectionState.value = ConnectionState.Error;
                    this.connectionError.value = "Error getting default provider, please install Metamask";
                    console.error(this.connectionError.value)
                    return;
                }
                
                this.signer = (this.provider as ethers.providers.Web3Provider).getSigner();
            }
        } catch(e) {
            this.connectionState.value = ConnectionState.Error;
            this.connectionError.value = "Error loading blockchain: " + e;
            console.error(this.connectionError.value);
            return;
        }
    
        this.chainId = (await this.provider.getNetwork()).chainId;
        this.chainName = (await this.provider.getNetwork()).name;

        // Setup change notification2
        // TODO: Figure out why I can't call this by passing func reference... odd
        (window.ethereum as Provider).on('accountsChanged', (accounts: Array<string>) => {
            this.accountsChanged(accounts);
        });

        (window.ethereum as Provider).on('chainChanged', (chainId: number) => {
            console.log()
            console.log(`BlockchainConnect::networkChanged ${chainId}... RELOADING...`);
            window.location.reload();
        });

        this.account.value = await this.signer!.getAddress();
        this.connectionState.value = ConnectionState.Connected;
        this.connectionError.value = "";

        //console.log("BlockchainConnect::connect() - Complete: ", this.provider, this.signer, this.account);
    }

    /**
     * Callback handler for when user changes accounts
     * 
     * @param accounts list of accounts - currently MetaMask only sets account[0]
     */
    chainChanged(chainId: number) {
        this.chainId = chainId;
        if(this._onChange != null) {
            console.log(`BlockchainConnect::networkChanged ${chainId}`);
        }
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
        return utils.toEtherStringRounded(weiBal, precision);
    }

}
