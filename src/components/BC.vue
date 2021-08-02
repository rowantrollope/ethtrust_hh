<template>

<div class="text-center ">
    <div class="bg-black">
        <div v-if="loaded" class="text-2xl md:text-4xl text-white p-1 font-thin mb-2">
            TrustContract: Loaded <br/>
        </div>
        <div v-else>
            Loading...
        </div>
    </div>

    <button class="text-base mx-2 font-normal bg-green-500 rounded-lg text-white hover:bg-green-300 p-2" :onClick="createTrust">CREATE</button>
    
    <button class="text-base mx-2 font-normal bg-indigo-500 rounded-lg text-white hover:bg-indigo-300 p-2" :onClick="readTrusts">READ</button>
    
    <button :class="[deletingMap.size > 0 ? 'animate-pulse' : '']" 
            class="text-base mx-2 font-normal bg-red-500 rounded-lg text-white hover:bg-red-300 p-2" :onClick="deleteTrust">DELETE</button>

    <button :class="[updatingMap.size > 0 ? 'animate-pulse' : '']"
            class="text-base mx-2 font-normal bg-blue-500 rounded-lg text-white hover:bg-blue-300 p-2" :onClick="updateTrust">
        UPDATE
    </button>    

    <form v-if="selectedTrust.key" class="text-sm font-normal mt-4 border border-gray-400 rounded-lg mx-2">
    <div class="bg-gray-100 rounded-t-lg p-1"> Trust Key: {{ shortenAddress(selectedTrust.key) }}</div>
    <div class="grid grid-cols-12 gap-2 mr-2 mb-2 mt-2">
        <div class="col-span-4 justify-self-end pt-2 ">
            <label for="trust_name" class="label-text">Trust name</label>
        </div>

        <div class="col-span-8">
            <input type="text" v-model="selectedTrust.name" name="trust_name" id="trust_name" autocomplete="trust-name" class="input-field" />
        </div>

        <div class="col-span-4 justify-self-end pt-2 ">
            <label for="beneficiary_account" class="label-text">Beneficiary Account</label>
        </div>
        <div class="col-span-8">
            <input type="text" v-model="selectedTrust.beneficiary" name="beneficiary_account" id="beneficiary_account" autocomplete="beneficiary_account" class="input-field" />
        </div>
        <div class="col-span-4 justify-self-end pt-2 ">
            <label for="trustee_account" class="label-text">Trustee Account</label>
        </div>
        <div class="col-span-8">
            <input type="text" v-model="selectedTrust.trustee" name="trustee_account" id="trustee_account" autocomplete="trustee_account" class="input-field" />
        </div>

    </div>
    </form>

        <!-- Account list -->
    <div class="text-sm text-black px-7 mt-5">

    <div class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                    <tr class="">
                        <th scope="col" class="col-header"> Key </th>
                        <th scope="col" class="col-header"> Name </th>
                        <th scope="col" class="col-header"> Beneficiary </th>
                        <th scope="col" class="col-header"> Ether </th>
                        <th scope="col" class="col-header"> Maturity Date </th>
                        <th scope="col" class="col-header"> Creator </th>
                        <th scope="col" class="col-header"> Created </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(trust, index) in trusts" :key="trust.key" 
                        class=" hover:bg-blue-100"
                        :class="[trust.key === selectedTrust.key ? 'bg-green-200' : '', 
                                index % 2 ? '' : '', 
                                updating(index) ? 'animate-pulse text-blue-500' : 'text-gray-900',
                                deleting(index) ? 'animate-pulse text-red-500' : 'text-gray-900']"
                        @click="onSelectItem(trust)">
                        <td class="row-text inline-flex">
                            <div v-if="updating(index)" class="loader ease-linear mr-2 rounded-full border-2 border-t-2 border-gray-200 h-4 w-4"></div>
                            {{ shortenAddress(trust.key) }}
                        </td>
                        <td class="row-text"> {{ trust.name }} </td>
                        <td class="row-text"> {{ shortenAddress(trust.beneficiary) }} </td>
                        <td class="row-text"> {{ ethers.utils.commify(toEther(trust.etherAmount)) }} </td>
                        <td class="row-text"> {{ toDate(trust.maturityDate) }} </td>
                        <td class="row-text"> {{ shortenAddress(trust.creator) }} </td>
                        <td class="row-text"> {{ toDate(trust.createdOn) }} </td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    </div>
    </div>

</div>

</template>

<script setup="props" lang="ts">
import { onBeforeMount, ref, computed } from 'vue';
import { ethers } from 'ethers';
import { BigNumber} from "@ethersproject/bignumber";
//import { Calendar, DatePicker } from 'v-calendar';


import BlockchainConnect from '../services/BlockchainConnect';

import Trust from "../services/Trust"
import { TrustContract, ChangeType } from '../services/TrustContract';
import { shortenAddress, toEther, toDate } from '../services/Helpers';

// BLOCKCHAIN connection and prep
let bc: BlockchainConnect;
let tc: TrustContract;

// refs
const loaded = ref(false);
let trusts = ref<Array<Trust>>();
let selectedTrust = ref<Trust>({});
const updatingMap = ref(new Map());
const deletingMap = ref(new Map());
const showEdit = ref(false);

const show = () => showEdit.value = !showEdit.value;
const updating = (index: number) : boolean => updatingMap.value.get(index); 
const deleting = (index: number) : boolean => deletingMap.value.get(index); 

const enum TrustState {
    Updating = 1,
    Deleting,
}
// props
const props = defineProps({
});

/**
 * METHODS
 */
const mounted = onBeforeMount(() => connect());

const connect = async () => {
    
    loaded.value = false;

    bc = new BlockchainConnect();

    await bc.connect();

    if(bc.signer) {
        tc = new TrustContract(bc.signer);
        tc.setOnChange(onTrustChange);
        loaded.value = true;
    }
    else 
        console.error("BC::connect() - Unable to connect to blockchain");

    bc.setOnChange((account: string) => { 
        console.log("Accounts Changed from: to: ", account);
    });

    await readTrusts();

}
const onTrustChange = async (key: string, change: ChangeType) => {

    if(trusts.value === undefined) {
        console.log("onTrustChange() - NOT READY - trusts.value === undefined");
        return        
    }

    const idx = trusts.value?.findIndex(trust => trust.key === key);

    console.log(`onChange: ${shortenAddress(key)}, Change Code: ${change}, trusts.length = ${trusts.value!.length}, Item to Update: ${idx}`);

    switch(change) {
        case ChangeType.TRUST_CREATED: 
            if(idx === -1)
            {
                let trust: Trust = await tc.getTrust(key);
                trusts.value?.push(trust);
            }
            else
                console.error("TRUST_CREATED Called again", shortenAddress(key));
            break;
        case ChangeType.TRUST_DELETED:
            if(idx != -1) {
                trusts.value?.splice(idx, 1)
                deletingMap.value.delete(idx);                
            }
            else
                console.error("onTrustChange(): Can't Find Trust to delete: ", shortenAddress(key));
            break;

        case ChangeType.TRUST_UPDATED:
            // IF WE FOUND A TRUST TO UPDATe
            if(idx != -1) {
                let newTrust: Trust = await tc.getTrust(key);
                trusts.value![idx] = newTrust;
                if(updatingMap.value.get(idx)) {
                    updatingMap.value.delete(idx);
                    console.log("updatingMap.get(idx)", idx, false);
                }

            } else
                console.error("onTrustChange(): Can't Find Trust to update: ", shortenAddress(key));
            break;
    }

}
const createTrust = async () => {
    const amount: BigNumber = ethers.utils.parseEther("10");

    await tc.createTrust(bc.account, bc.account, "Test", 0, amount, bc.account);
    
    //readTrusts();
}
const readTrusts = async () => {
    
    trusts.value = await tc.getTrusts((trust: Trust) => { return true; });
    console.log("readTrusts()", trusts.value);
}
const updateTrust = async() => {

    let newTrust: Trust = new Trust();
    Object.assign(newTrust, selectedTrust.value);

    // Quick-update support
    let index = trusts.value!.findIndex(found => found.key === newTrust.key)
    trusts.value![index] = newTrust;

    await tc.updateTrust(newTrust.key,
                         newTrust.beneficiary,
                         newTrust.trustee,
                         newTrust.name,
                         newTrust.maturityDate);
    
    updatingMap.value.set(index, TrustState.Updating);

    selectedTrust.value.key = "";
    return;

}

const onSelectItem = (trust: Trust) => {
    Object.assign(selectedTrust.value, trust);
    console.log("Item Selected: " + shortenAddress(selectedTrust.value.key));
} 

const deleteTrust = async () => {
    await tc.deleteTrust(selectedTrust.value.key);
    
    const index = trusts.value!.findIndex(found => found.key === selectedTrust.value.key)

    selectedTrust.value.key = "";

    deletingMap.value.set(index, TrustState.Deleting);
}

</script>

<style scoped>
    .row-selected {
        @apply bg-green-100;
    }
    .col-header {
        @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
    }
    .row {
        @apply bg-gray-100;
    }
    .row-text {
        @apply font-medium px-1 py-3 whitespace-nowrap md:text-sm text-xs;
    }
    .input-field {
        @apply  text-sm p-2 block border focus:ring-indigo-500 focus:border-indigo-500 w-full min-w-0 rounded-md border-gray-300;
    }
    .label-text {
        @apply block text-left text-sm font-medium text-gray-700;
    }
    .loader {
    border-top-color: #3498db;
    -webkit-animation: spinner 1.5s linear infinite;
    animation: spinner 1.5s linear infinite;
  }
  
  @-webkit-keyframes spinner {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
  }
  
  @keyframes spinner {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
