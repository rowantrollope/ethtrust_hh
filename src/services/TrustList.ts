import { ref } from 'vue';

import { Signer } from 'ethers';
import { BigNumber} from "@ethersproject/bignumber";

import { Trust } from "./Trust";
import { TrustContract, ChangeType, FilterCallback } from './TrustContract';
import { shortenAddress } from './Helpers';

enum TrustState {
    Updating = 1,
    Deleting,
};

export default class TrustList extends TrustContract {

    // BLOCKCHAIN connection and prep
    //public tc: TrustContract | null = null;

    // refs
    public trusts = ref<Array<Trust>>();
    
    // quick updates: 
    // These maps show which items are awaiting updates 
    // from the blockchain
    public updateMap = ref(new Map());

    constructor() {
        super();
    }

    /**
     * 
     * @param signer Signer for connection
     */
    async connect(signer: Signer) {
        await super.connect(signer);

        //console.log("TrustList::connect()");

        // Quick-update support
        super.setOnChange(this.changeHandler);

    }

    /**
     * 
     * @param index Item updating
     * @returns bool whether item is awaiting blockchain update
     */
    updating = (key: string) : boolean => this.updateMap.value.get(key) == TrustState.Updating;
    
    /**
     * 
     * @param index Item deleting
     * @returns bool whether item is awaiting blockchain
     */
    deleting = (key: string) : boolean => this.updateMap.value.get(key) == TrustState.Deleting;

    /**
     * 
     * @param key trust 
     * @returns bool if item is awaiting blockchain 
     */
    creating = (key: string) : boolean => key === '0x0'; 

    /**
     * 
     * @param key trust being updated
     * @param change What type of chain
     * @returns void
     */
    changeHandler = async (key: string, change: ChangeType) => {

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
                    console.error("TRUST_CREATED Called again", shortenAddress(key));
                break;
            case ChangeType.TRUST_DELETED:
                if(idx != -1) {
                    this.trusts.value?.splice(idx, 1)
                    this.updateMap.value.delete(key);               
                }
                else
                    console.error("BC.vue::onTrustChange() - TRUST_DELETE Can't Find trust: ", shortenAddress(key));
                break;

            case ChangeType.TRUST_WITHDRAW:
            case ChangeType.TRUST_DEPOSIT:
            case ChangeType.TRUST_UPDATED:
                // IF WE FOUND A TRUST TO UPDATe
                if(idx != -1) {
                    let newTrust: Trust = await super.getTrust(key);
                    this.trusts.value![idx] = newTrust;
                    if(this.updateMap.value.get(key)) {
                        this.updateMap.value.delete(key);
                        console.log("updatingMap.get(idx)", idx, false);
                    }

                } else
                    //console.error("BC.vue::onTrustChange() - Can't Find Trust: ", shortenAddress(key));
                break;
        }

    }

    createTrust = async (newTrust: Trust) => {
        // Quick Update Support 
        newTrust.key = "0x0";
        this.trusts.value?.push(newTrust);
        await super.createTrust(newTrust);
    }
    
    getTrusts = async (filter: FilterCallback): Promise<Array<Trust>> =>
        this.trusts.value = await super.getTrusts(filter);        
    
    updateTrust = async (trust: Trust) => {
        // Quick-update support
        let index = this.trusts.value!.findIndex(found => found.key === trust.key)
        
        if(index !== -1) {
            //console.log("TrustList::updateTrust() Updating: ", trust.key);
            //console.log("TrustList::updateTrust() Found: ", index, this.trusts.value![index]);
            this.trusts.value![index].clone(trust);        
            this.updateMap.value.set(trust.key, TrustState.Updating);
        }
        // call base
        await super.updateTrust(trust);
    }

    withdraw = async (key: string, amount: BigNumber): Promise<boolean> => {

        this.updateMap.value.set(key, TrustState.Updating);

        let success = await super.withdraw(key, amount);

        if(success == true) {
            console.log("set update flag")
        }
        else
            window.alert("An error occured withdrawing funds");
        
        return success;
    }

    deposit = async (key: string, amount: BigNumber) => {
        this.updateMap.value.set(key, TrustState.Updating);
        super.deposit(key, amount);
    }

    deleteTrust = async (key: string): Promise<boolean> => {
        this.updateMap.value.set(key, TrustState.Deleting);
        return await super.deleteTrust(key);
    }
}
