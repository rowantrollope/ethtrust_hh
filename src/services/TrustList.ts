import { ref } from 'vue';

import { Signer } from 'ethers';
import { BigNumber} from "@ethersproject/bignumber";
import Notify from "bnc-notify";

import Trust from "./Trust";
import { TrustContract, ChangeType, FilterCallback } from './TrustContract';
import { utils } from './Utils';

enum TrustState {
    None = 0,
    Updating,
    Deleting,
    Creating,
};
const API_KEY = "aa675d4d-8d3c-44a1-aba5-a85dce42fc8c";
const NETWORK_RINKEBY = 4;
const NETWORK_MAINNET = 1;
const USE_BNC_NOTIFY = true;

export default class TrustList extends TrustContract {

    // refs
    public trusts = ref<Array<Trust>>();
    
    // quick updates: 
    // These maps show which items are awaiting updates 
    // from the blockchain
    public updateMap = ref(new Map());
    
    private manualTimer: NodeJS.Timeout | undefined;
    private notify = Notify({
        dappId: API_KEY,
        networkId: NETWORK_MAINNET,
    });

    /**
     * Constructor 
     */
    constructor() {
        super();
    }

    /**
     * connects to the trust contract 
     * @param signer Signer for connection
     */
    async connect(signer: Signer) {
        await super.connect(signer);

        if(USE_BNC_NOTIFY) {
            const networkId = await signer.getChainId();
            this.notify.config({
                networkId: networkId,
                desktopPosition: "topRight",
            });    
        }
        super.setOnChange(this.changeHandler);

    }

    /**
     * Returns whether a trust is updating
     * @param index Item updating
     * @returns bool whether item is awaiting blockchain update
     */
    updating = (key: string) : boolean => this.updateMap.value.get(key) === TrustState.Updating;
    
    /**
     * Returns whether a trust is being deleted
     * @param index Item deleting
     * @returns bool whether item is awaiting blockchain
     */
    deleting = (key: string) : boolean => this.updateMap.value.get(key) === TrustState.Deleting;

    /**
     * Returned whether a trust is being created
     * @param key trust 
     * @returns bool if item is awaiting blockchain 
     */
    creating = (key: string) : boolean => key === '0x0'; 

    /**
     * returns the update state of a trust
     * @param key trust to read
     * @returns 
     */
    trustState = (key: string) : TrustState => {
        const state: TrustState = this.updateMap.value.get(key);
        if(state)
            return state;
        else if(key === '0x0')
            return TrustState.Creating;
        else
            return TrustState.None; 
    };

    /**
     * changeHandler for updating trust changes from the blockchain
     * @param key trust being updated
     * @param change What type of chain
     * @returns void
     */
    changeHandler = async (key: string, change: ChangeType) => {
        console.log("changeHandler() - ", key, change);
        if(this.trusts.value === undefined) 
            return ;       

        const idx = this.trusts.value?.findIndex(trust => trust.key === key);

        switch(change) {
            case ChangeType.TRUST_CREATED: 
                if(idx === -1)
                {
                    const temp = this.trusts.value?.findIndex(trust => trust.key === '0x0');
                    if(temp !== -1) {
                        this.trusts.value?.splice(temp, 1);
                    }
                    let trust: Trust = await super.getTrust(key);

                    this.trusts.value?.push(trust);
                }
                else
                    console.error("TRUST_CREATED Called again", utils.shortenAddress(key));
                break;
            case ChangeType.TRUST_DELETED:
                if(idx != -1) {
                    this.trusts.value?.splice(idx, 1)

                    this.updateMap.value.delete(key);               
                }
                else
                    console.error("BC.vue::onTrustChange() - TRUST_DELETE Can't Find trust: ", utils.shortenAddress(key));
                break;

            case ChangeType.TRUST_WITHDRAW:
            case ChangeType.TRUST_DEPOSIT:
            case ChangeType.TRUST_UPDATED:
                // IF WE FOUND A TRUST TO UPDATe
                if(idx != -1) {
                    // test
                    let newTrust: Trust = await super.getTrust(key);
                    console.log("NEW TRUST ", utils.formatEtherString(newTrust.etherAmount));

                    this.trusts.value![idx] = newTrust;
                    if(this.updateMap.value.get(key)) {
                        this.updateMap.value.delete(key);
                        console.log("updatingMap.get(idx)", idx, false);
                    }

                } else
                    console.error("BC.vue::onTrustChange() - Can't Find Trust: ", utils.shortenAddress(key));
                break;
        }
        // IF we receive all the updates, clear the manual refresh timer
        if(this.updateMap.value.size === 0) {
            clearTimeout((this.manualTimer as NodeJS.Timeout));
        }

    }

    /**
     * getTrusts returns an array of trusts
     * @param filter Which trusts to include
     * @returns trust array
     */
    getTrusts = async (filter: FilterCallback): Promise<Array<Trust>> => {
        this.trusts.value = await super.getTrusts(filter);        
        this.updateMap.value.clear();
        return this.trusts.value;
    }
    

    /**
     * uses Notify to watch transaction state and notify user
     * @param hash Transaction to watch
     * @param key trust
     * @param type change type
     */
    private _notifyChange(hash: any, key: string, type: ChangeType, refreshDelay: number = 20000) {

        if(USE_BNC_NOTIFY) {
            const { emitter } = this.notify.hash(hash);
            emitter.on('txConfirmed', transaction => { 
                console.log("TXCONFIRMED: ", transaction);
                if(key.length)
                    setTimeout(() => { this.changeHandler(key, type); }, refreshDelay) 
            });
        }
    }

    /**
     * Creates a new trust and deposits ETH to it
     * @param newTrust trust to create
     */
     createTrust = async (newTrust: Trust) => {
        // Quick Update Support 
        newTrust.key = "0x0";

        this.trusts.value?.push(newTrust);

        const { hash } = await super.createTrust(newTrust);

        this._notifyChange(hash, "", ChangeType.TRUST_CREATED);

    }

    /**
     * Updates fields in a trust
     * @param trust trust to update
     */
    updateTrust = async (trust: Trust) => {
        // Quick-update support
        let index = this.trusts.value!.findIndex(found => found.key === trust.key)
        
        if(index !== -1) {
            //console.log("TrustList::updateTrust() Updating: ", trust.key);
            console.log("TrustList::updateTrust() Found: ", index, this.trusts.value![index]);
            this.trusts.value![index].clone(trust);        
            this.setUpdateState(trust.key, TrustState.Updating);
        }
        // call base
        const { hash } = await super.updateTrust(trust);

        this._notifyChange(hash, trust.key, ChangeType.TRUST_UPDATED);

    }
    /**
     * Withdraw eth from a trust
     * @param key trust to withdraw from
     * @param amount amount to withdraw in wei
     * @returns success or failure
     */
    withdraw = async (key: string, amount: BigNumber) => {

        this.setUpdateState(key, TrustState.Updating);

        const { hash } = await super.withdraw(key, amount);

        this._notifyChange(hash, key, ChangeType.TRUST_WITHDRAW);

    }

    /**
     * Deposit ETH to a trust
     * @param key trust to deposit to
     * @param amount how much eth in wei
     */
    deposit = async (key: string, amount: BigNumber) => {
        this.setUpdateState(key, TrustState.Updating);

        const { hash } = await super.deposit(key, amount);
        
        this._notifyChange(hash, key, ChangeType.TRUST_DEPOSIT);
    }

    /**
     * Delete a trust
     * @param key Trust t0 delete - must have 0 balance
     * @returns success or failure
     */
    deleteTrust = async (key: string) => {
        this.setUpdateState(key, TrustState.Deleting);
        try {
            const { hash } = await super.deleteTrust(key);

            this._notifyChange(hash, key, ChangeType.TRUST_DELETED, 0);

        } catch (err) {
            window.alert(err);
        }

    }

    /**
     * Sets an internal flag describing the update made to a trust
     * @param key trust to set update flag for
     * @param state update state
     */
    private setUpdateState = (key: string, state: TrustState) => {
        this.updateMap.value.set(key, state);

        if(!USE_BNC_NOTIFY) {
            clearTimeout((this.manualTimer as NodeJS.Timeout));
            this.manualTimer = setTimeout(() => this.manualRefresh(), 30000);    
        }
    }

    /**
     * Refreshes the trust list after a timeout...
     */
    private manualRefresh = async () => {
        // If after X seconds, we haven't gotten an update, do a manual refresh
        console.log("TrustList::manualRefresh() - Updates in queue: ", this.updateMap.value.size)
        if(this.updateMap.value.size) {
            this.manualUpdates();
        }
    }

    /**
     * Callback that refreshes all trusts manually 
     */
    private manualUpdates = async () => {

        // walk through the updateMap, updating each trust manually 
        this.updateMap.value.forEach(async (value, key, map) => {
            const idx = this.trusts.value?.findIndex(trust => trust.key === key);

            if(idx === -1 || idx === undefined) return;

            let newTrust: Trust = await super.getTrust(key);
            
            this.trusts.value![idx] = newTrust;

            this.updateMap.value.delete(key);            
        });
        
    }
}
