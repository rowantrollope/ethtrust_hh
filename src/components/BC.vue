<template>

<div class="mt-10 text-center text-6xl text-blue-500 font-black">
    <div v-if="loaded" >
        TrustContract: Loaded <br/>
    </div>
    <div v-else>
        Loading...
    </div>

    <button class="text-lg mx-2 font-normal bg-green-500 rounded-lg text-white hover:bg-green-300 p-2" :onClick="createTrust">CREATE</button>
    <button class="text-lg mx-2 font-normal bg-green-500 rounded-lg text-white hover:bg-green-300 p-2" :onClick="readTrusts">READ</button>
    <button class="text-lg mx-2 font-normal bg-blue-500 rounded-lg text-white hover:bg-blue-300 p-2" :onClick="updateTrust">UPDATE</button>    
    <button class="text-lg mx-2 font-normal bg-red-500 rounded-lg text-white hover:bg-red-300 p-2" :onClick="deleteTrust">DELETE</button>
        <!-- Account list -->
    <div class="text-sm text-black px-7 mt-5">

    <div class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                    <tr>
                        <th scope="col" class="col-header">
                            Key
                        </th>
                        <th scope="col" class="col-header">
                            Name
                        </th>
                        <th scope="col" class="col-header">
                            Beneficiary
                        </th>
                        <th scope="col" class="col-header">
                            Ether
                        </th>
                        <th scope="col" class="col-header">
                            Maturity Date
                        </th>
                        <th scope="col" class="col-header">
                            Creator
                        </th>
                        <th scope="col" class="col-header">
                            Created On:
                        </th>

                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(trust, index) in trusts" :key="trust.key" 
                        class=" hover:bg-blue-100"
                        :class="[trust.key === selectedTrust.key ? 'bg-green-200' : '', index % 2 ? '' : '', ]"
                        @click="onSelectItem(trust)">

                        <td class="row-text font-medium text-gray-900">
                            {{ shortenAddress(trust.key) }}
                        </td>
                        <td class="row-text font-medium text-gray-900">
                            {{ trust.name }}
                        </td>
                        <td class="row-text font-medium text-gray-900">
                            {{ shortenAddress(trust.beneficiary) }}
                        </td>
                        <td class="row-text text-gray-500">
                            {{ ethers.utils.commify(toEther(trust.etherAmount)) }}
                        </td>
                        <td class="row-text text-gray-500">
                            {{ toDate(trust.maturityDate) }}
                        </td>
                        <td class="row-text text-gray-500">
                            {{ shortenAddress(trust.creator) }}
                        </td>
                        <td class="row-text text-gray-500">
                            {{ toDate(trust.createdOn) }}
                        </td>
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
import { onBeforeMount, ref } from 'vue';
import { ethers } from 'ethers';
import { BigNumber} from "@ethersproject/bignumber";
import BlockchainConnect from '../services/BlockchainConnect';

import Trust from "../services/Trust"
import { TrustContract, ChangeType } from '../services/TrustContract';
import { shortenAddress, toEther, toDate } from '../services/Helpers';

// BLOCKCHAIN connection and prep
let bc: BlockchainConnect;
let tc: TrustContract;

// refs
const loaded = ref(false);
const trusts = ref<Array<Trust>>();
const selectedTrust = ref<Trust>({});

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
        console.log("Accounts Changed from: to: ", account.address);
    });

    await readTrusts();

}
const onTrustChange = async (key: string, change: ChangeType) => {

    console.log("onChange: ", key, change);

    const idx = trusts.value?.findIndex(trust => trust.key === key);

    switch(change) {
        case ChangeType.TRUST_CREATED: 
            if(idx === -1)
            {
                console.log("onTrustChange() - Reading new trust", shortenAddress(key));
                let trust: Trust = await tc.getTrust(key);
                console.log("onTrustChange() - Loading trust", shortenAddress(key));
                trusts.value?.push(trust);
            }
            else
                console.error("TRUST_CREATED Called again", shortenAddress(key));
            break;
        case ChangeType.TRUST_DELETED:
            if(idx != -1)
                trusts.value?.splice(idx, 1)
            else
                console.error("Can't Find Trust: ", shortenAddress(key));
            break;
        case ChangeType.TRUST_UPDATED:
            let index = trusts.value!.findIndex(trust => trust.key === key);
            let newTrust: Trust = await tc.getTrust(key);
            trusts.value![index] = newTrust;
            break;
    }
    console.log("onTrustChange - Finished")
}
const createTrust = async () => {
    const amount: BigNumber = ethers.utils.parseEther("10");

    await tc.createTrust(bc.account, bc.account, "Test", 0, amount, bc.account);
    
    //readTrusts();
}
const readTrusts = async () => {
    
    trusts.value = await tc.getTrusts((trust: Trust) => { return true; });
}
const updateTrust = async() => {
    const trust: Trust = selectedTrust.value;

    await tc.updateTrust(trust.key,
                         trust.beneficiary,
                         trust.trustee,
                         "Updated!",
                         trust.maturityDate);

}

const onSelectItem = (trust: Trust) => {
    selectedTrust.value = trust;
    console.log("Item Selected: " + shortenAddress(selectedTrust.value.key));
} 

const deleteTrust = async () => {
    await tc.deleteTrust(selectedTrust.value.key);
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
        @apply font-medium px-6 py-4 whitespace-nowrap md:text-sm text-xs;
    }
</style>
