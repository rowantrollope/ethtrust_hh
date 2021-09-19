
import { ref, Ref } from 'vue';
import { ethers, Signer } from 'ethers';

import Onboard from 'bnc-onboard';

import type {Provider} from '@ethersproject/abstract-provider';
import { BigNumber } from '@ethersproject/bignumber'

import { utils } from './Utils';

interface changeNetworkCallback { (chainId: number): void }
interface changeAddressCallback { (address: string): void }

export enum ConnectionState {
    Unknown = 0,
    NotConnected,
    Connecting,
    Connected,
    Error,
};

const API_KEY = "aa675d4d-8d3c-44a1-aba5-a85dce42fc8c";
const NETWORK_RINKEBY = 4;
const NETWORK_MAINNET = 1;

export class BlockchainConnect {

    private onboard;    
    private lastWallet: string|null;
    private _onNetworkChange: changeNetworkCallback|null;
    private _onAddressChange: changeAddressCallback|null;

    public balance: string;
    public provider: Provider|null;
    public signer: Signer|null;
    public chainId: number;

    // Reactive members
    public walletName: Ref<string>;
    public walletIcon: Ref<string>;
    public account: Ref<string>;
    public connectionState: Ref<ConnectionState>;
    public connectionError: Ref<string>;
    
    constructor() {
        const lastNetwork = window.localStorage.getItem('lastNetworkId');
        const networkId = lastNetwork ? Number(lastNetwork) : NETWORK_MAINNET; // DEFAULT

        this.onboard_options.networkId = networkId;

        this.onboard = Onboard(this.onboard_options);

        this.provider = null;
        this.signer = null;
        this._onNetworkChange = null;
        this._onAddressChange = null;
        this.chainId = 0;
        
        this.connectionState = ref(ConnectionState.Unknown);
        this.connectionError = ref("");
        this.account = ref("");
        this.walletName = ref("");
        this.walletIcon = ref("");
        this.balance = "";
        this.lastWallet = window.localStorage.getItem('selectedWallet');
    }

    private setWallet = async (wallet: any) => {
    
        if (wallet.provider) {
            this.provider = new ethers.providers.Web3Provider(wallet.provider);
            this.signer = (this.provider as ethers.providers.Web3Provider).getSigner();
            this.walletIcon.value = wallet.icons.iconSrc;
            if (wallet.name) {
                this.walletName.value = wallet.name ? wallet.name : "";
                window.localStorage.setItem('selectedWallet', wallet.name);
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
     setNetwork = (chainId: number) => {
        this.chainId = chainId;
        //window.location.reload();
        console.log(`BlockchainConnect::networkChanged ${chainId}`);
        window.localStorage.setItem('lastNetworkId', chainId.toString());
        
        if(this._onNetworkChange != null)
            this._onNetworkChange(this.chainId);
    
    }

    /**
     * Callback handler for when user changes accounts
     * 
     * @param accounts list of accounts - currently MetaMask only sets account[0]
     */
    setAddress = (account: string) => {
        this.account.value = account;

        console.log("BlockchainConnect::accountsChanged()", this.account.value);

        // call user supplied change notification callback
        if(this._onAddressChange != null) {
            //console.log(this.account.value);
            this._onAddressChange(this.account.value); 
        }   
    }
    
    /**
     * Sets the callback to be used when the account changes
     * @param _onChange changeCallback
     */
    setOnNetworkChange(onNetworkChange: changeNetworkCallback|null) {
        this._onNetworkChange = onNetworkChange;
    } 
    setOnAddressChange(onAddressChange: changeAddressCallback|null) {
        this._onAddressChange = onAddressChange;
    }    
    
    private onboard_options = {
        dappId: API_KEY,       // [String] The API key created by step one above
        networkId: NETWORK_RINKEBY,  // [Integer] The Ethereum network ID your Dapp uses.
        subscriptions: {
            balance: this.setBalance,
            network: this.setNetwork,
            address: this.setAddress,
            wallet: this.setWallet,
        }
    };
    async connectNewWallet(): Promise<void> {
        console.log("HI");
        await this.onboard.walletSelect();
    }
    async walletReset(): Promise<void> {
        await this.onboard.walletReset();
    }

    async connect(): Promise<void> {
        try {
            this.connectionState.value = ConnectionState.Connecting;

            if(this.lastWallet)
                await this.onboard.walletSelect(this.lastWallet);
            else
                await this.onboard.walletSelect();

            const readyToTransact = await this.onboard.walletCheck();
        
        } catch(e) {
            this.connectionState.value = ConnectionState.Error;
            this.connectionError.value = "Error loading wallet: " + e;
            console.error(this.connectionError.value);
            return;
        }
        // Permit typescript to allow window.ethereum
        //let window: any;
        //@ts-ignore
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
