/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ref, provide, inject, Ref } from 'vue';
import { ethers, Signer } from 'ethers';

import Onboard from 'bnc-onboard';
import { Wallet } from 'bnc-onboard/dist/src/interfaces';

import type { Provider } from '@ethersproject/abstract-provider';
import { BigNumber } from '@ethersproject/bignumber'

import * as utils from './Utils';

interface changeNetworkCallback { (chainId: number): void }
interface changeWalletCallback { (wallet: string): void }
interface changeAddressCallback { (address: string): void }

export enum ConnectionState {
    Unknown = 0,
    NotConnected,
    Connecting,
    Connected,
    Error,
}

const API_KEY = import.meta.env.VITE_ONBOARD_API_KEY;
//const API_KEY ="aa675d4d-8d3c-44a1-aba5-a85dce42fc8c";
// const NETWORK_RINKEBY = 4;
const NETWORK_MAINNET = 1;
const DEFAULT_NETWORK = NETWORK_MAINNET; // DEFAULT

export const bcSymbol = Symbol('BlockchainConnect');
export const useBlockchainConnect = (): BlockchainConnect => <BlockchainConnect> inject(bcSymbol);
export const provideBlockchainConnect = (): BlockchainConnect => {
    const bc = new BlockchainConnect();
    provide(bcSymbol, bc);
    return bc;
}

export class BlockchainConnect {

    private onboard; 
    private _onNetworkChange: changeNetworkCallback | null;
    private _onWalletChange: changeWalletCallback | null;
    private _onAddressChange: changeAddressCallback | null;

    public balance: string;
    public provider: Provider | null;
    public signer: Signer | null;
    public chainId: number;

    // Reactive members
    public walletName: Ref<string>;
    public walletIcon: Ref<string>;
    public account: Ref<string>;
    public connectionState: Ref<ConnectionState>;
    public connectionError: Ref<string>;
    
    constructor() {
        
        this.onboard = Onboard(this.onboard_options);
        //console.log(this.onboard_options);
        this.provider = null;
        this.signer = null;
        this._onNetworkChange = null;
        this._onWalletChange = null;
        this._onAddressChange = null;
        this.chainId = 0;
        
        this.connectionState = ref(ConnectionState.Unknown);
        this.connectionError = ref("");
        this.account = ref("");
        this.walletName = ref("");
        this.walletIcon = ref("");
        this.balance = "";
    }

    private setWallet = async (wallet: Wallet) => {
    
        if (wallet.provider) {
            this.provider = new ethers.providers.Web3Provider(wallet.provider);
            this.signer = (this.provider as ethers.providers.Web3Provider).getSigner();
            if(wallet.icons.iconSrc)
                this.walletIcon.value = wallet.icons.iconSrc;

            if (wallet.name) {
                this.walletName.value = wallet.name;
                if(this._onWalletChange)
                    this._onWalletChange(wallet.name);
            }
        }
        else {
            this.provider = null;
            this.signer = null;
            this.walletName.value = ""; 

            this.connectionState.value = ConnectionState.Error;
        }
    }
    private setBalance = (balance: string) => this.balance = balance;

    /**
     * Callback handler for when user changes accounts
     * 
     * @param accounts list of accounts - currently MetaMask only sets account[0]
     */
     setNetwork = (chainId: number): void => {
        this.chainId = chainId;
        
        if(this._onNetworkChange != null)
            this._onNetworkChange(this.chainId);
    
    }

    /**
     * Callback handler for when user changes accounts
     * 
     * @param accounts list of accounts - currently MetaMask only sets account[0]
     */
    setAddress = (account: string): void => {
        this.account.value = account;

        console.log("BlockchainConnect::accountsChanged()", this.account.value);

        // call user supplied change notification callback
        if(this._onAddressChange != null) {
            //console.log(this.account.value);
            this._onAddressChange(this.account.value); 
        }   
    }

    private onboard_options = {
        dappId: <string> API_KEY,       // [String] The API key created by step one above
        networkId: DEFAULT_NETWORK,  // [Integer] The Ethereum network ID your Dapp uses.
        subscriptions: {
            balance: this.setBalance,
            network: this.setNetwork,
            address: this.setAddress,
            wallet: this.setWallet,
        }
    };

    /**
     * Sets the callback to be used when the account changes
     * @param _onChange changeCallback
     */
    setOnNetworkChange = (onNetworkChange: changeNetworkCallback|null): void => { this._onNetworkChange = onNetworkChange; };
    setOnAddressChange = (onAddressChange: changeAddressCallback|null): void => { this._onAddressChange = onAddressChange; };
    setOnWalletChange = (onWalletChange: changeWalletCallback|null): void => { this._onWalletChange = onWalletChange; };
    
    async connect(walletName: string | null = null, networkId: number | null = null): Promise<void> {
        try {
            this.connectionState.value = ConnectionState.Connecting;
           
            this.onboard_options.networkId = networkId ? networkId : DEFAULT_NETWORK;

            this.onboard = Onboard(this.onboard_options);

            if(walletName)
                await this.onboard.walletSelect(walletName);
            else
                await this.onboard.walletSelect();

            await this.onboard.walletCheck();
        
        } catch(e) {
            this.connectionState.value = ConnectionState.Error;
            this.connectionError.value = "Error loading wallet: " + e;
            console.error(this.connectionError.value);
            return;
        }
        // Permit typescript to allow window.ethereum
        //let window: any;
        //@ts-ignore Ignore something
        (window.ethereum as Provider).on('chainChanged', (chainId: number) => {
            console.log(`BlockchainConnect::networkChanged ${chainId}... RELOADING...`);
            window.location.reload();
        });    

        this.connectionState.value = ConnectionState.Connected;
        this.connectionError.value = "";

        //console.log("BlockchainConnect::connect() - Complete: ", this.provider, this.signer, this.account);
    }

    
    /**
     * Gets the ETHER balance of an account 
     * @param address Account to get balance for
     * @returns promise to the balance in WEI - a string
     */
    async getBalance() : Promise<BigNumber> {
        if(this.provider) {
            return await this.provider.getBalance(this.account.value)
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
    async getBalanceString(precision = 2 ) : Promise<string> {
        if(this.provider) {
            const weiBal = await this.provider.getBalance(this.account.value);
            return utils.toEtherStringRounded(weiBal, precision);
        } else {
            console.error("BlockchainConnect::balanceOf() - not loaded yet - call connect first")
            return "NaN";
        }
    }

}
