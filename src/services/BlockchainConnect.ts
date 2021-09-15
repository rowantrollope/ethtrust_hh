
import { ref, Ref } from 'vue';
import { ethers, Signer } from 'ethers';
import Onboard from 'bnc-onboard';

import type {Provider} from '@ethersproject/abstract-provider';
import { BigNumber } from '@ethersproject/bignumber'
import detectEthereumProvider from "@metamask/detect-provider";
import { utils } from './Utils';

interface changeCallback { (myArgument: string): void }

export enum ConnectionState {
    Unknown = 0,
    NotConnected,
    Connecting,
    Connected,
    Error,
};

const API_KEY = "aa675d4d-8d3c-44a1-aba5-a85dce42fc8c";
const NETWORK_RINKEBY = 4;

export class BlockchainConnect {

    private onboard_options = {
        dappId: API_KEY,       // [String] The API key created by step one above
        networkId: NETWORK_RINKEBY,  // [Integer] The Ethereum network ID your Dapp uses.
        subscriptions: {
            balance: (balance: string) => {
                this.balance = balance;
            },
            network: (network: number) => { this.chainId = network; },
            address: (address: string) => { 
                this.account.value = address; 
                this.accountsChanged(address);
            },
            wallet: wallet => {
    
                if (wallet.provider) {
                    this.provider = new ethers.providers.Web3Provider(wallet.provider);
    
                    if (wallet.name) {
                        this.walletName.value = wallet.name ? wallet.name : "";
                        window.localStorage.setItem('selectedWallet', wallet.name);
                    }
                }
                else {
                    // reset to zeros
                }
            }
        }
    };
    
    private onboard;
    private lastWallet: string|null;
    public balance: string;
    public provider: Provider|null;
    public signer: Signer|null;
    public chainId: number;
    private _onChange: changeCallback|null;

    // Reactive members
    public walletName: Ref<string>;
    public account: Ref<string>;
    public connectionState: Ref<ConnectionState>;
    public connectionError: Ref<string>;

    constructor() {
        this.onboard = Onboard(this.onboard_options);

        this.provider = null;
        this.signer = null;
        this._onChange = null;
        this.chainId = 0;

        this.connectionState = ref(ConnectionState.Unknown);
        this.connectionError = ref("");
        this.account = ref("");
        this.walletName = ref("");
        this.balance = "";
        this.lastWallet = window.localStorage.getItem('selectedWallet');
    }

    async connect(): Promise<void> {
        try {
            this.connectionState.value = ConnectionState.Connecting;

            if(this.lastWallet)
                await this.onboard.walletSelect(this.lastWallet);
            else
                await this.onboard.walletSelect();

            const readyToTransact = await this.onboard.walletCheck();
    
            this.signer = (this.provider as ethers.providers.Web3Provider).getSigner();
    
            if(this.signer === null || this.signer === undefined)
            {
                this.connectionState.value = ConnectionState.Error;
                this.connectionError.value = "BlockchainConnect::connect() Signer returned null";
                console.error(this.connectionError.value);
                return;
            }
        
        } catch(e) {
            this.connectionState.value = ConnectionState.Error;
            this.connectionError.value = "Error loading blockchain: " + e;
            console.error(this.connectionError.value);
            return;
        }
    
        (window.ethereum as Provider).on('chainChanged', (chainId: number) => {
            console.log(`BlockchainConnect::networkChanged ${chainId}... RELOADING...`);
            window.location.reload();
        });

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

    accountsChanged(account: string) {

        console.log("BlockchainConnect::accountsChanged()", this.account.value);

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
            return BigNumber.from(this.balance);
            //return await this.provider.getBalance(this.account.value);
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
