<template>
<div v-if="loaded">
<div class="text-center ">
    <div class="bg-black">
        <div v-if="loaded" class="text-2xl md:text-4xl text-white p-1 font-thin mb-2">
            TrustContract: Loaded {{ shortenAddress( account ) }} <br/>
        </div>
        <div v-else>
            Loading...
        </div>
    </div>

    <button class="text-base mx-2 font-normal bg-green-500 rounded-lg text-white hover:bg-green-300 p-2" :onClick="createTrust">CREATE</button>
    <Button v-if="selectedTrust.key" class="btn btn-primary" :onClick="onEdit">EDIT</Button>
    <button class="text-base mx-2 font-normal bg-indigo-500 rounded-lg text-white hover:bg-indigo-300 p-2" :onClick="getTrusts">READ</button>
    
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
                        <th scope="col" class="col-header"> Type </th>
                        <th scope="col" class="col-header"> Grantor </th>
                        <th scope="col" class="col-header"> Trustees </th>
                        <th scope="col" class="col-header"> Beneficiary </th>
                        <th scope="col" class="col-header"> Ether </th>
                        <th scope="col" class="col-header"> Maturity Date </th>
                        <th scope="col" class="col-header"> Created </th>

                    </tr>
                    </thead>
                    <tbody>

                    <tr v-for="(trust, index) in list.trusts.value" :key="trust.key" 
                        class=" hover:bg-blue-100"
                        :class="[selected(trust.key) ? 'bg-green-200' : '', 
                                list.creating(trust.key) ? 'animate-pulse text-green-500' : 'text-gray-900',
                                list.updating(trust.key) ? 'animate-pulse text-blue-500' : 'text-gray-900',
                                list.deleting(trust.key) ? 'animate-pulse text-red-500' : 'text-gray-900']" 
                        @click="onSelectItem(trust)">
                        <td class="row-text inline-flex">
                            <!-- <div v-if="list.updating(index)" class="loader ease-linear mr-2 rounded-full border-2 border-t-2 border-gray-200 h-4 w-4"></div>-->
                            {{ shortenAddress(trust.key) }}
                        </td>
                        <td class="row-text"> {{ trust.name }} </td>
                        <td class="row-text"> {{ TypeStrings[trust.trustType] }} </td>
                        <td class="row-text"> {{ shortenAddress(trust.grantor) }} </td>
                        <td class="row-text"> 
                            <div v-for="trustee in trust.trustees">{{ shortenAddress(trustee) }}, </div>
                        </td>
                        <td class="row-text"> 
                            {{ shortenAddress(trust.beneficiaries[0]) }}
                        </td>
                        <td class="row-text"> {{ ethers.utils.commify(toEther(trust.etherAmount)) }} </td>
                        <td class="row-text"> {{ toDate(trust.maturityDate.toNumber()) }} </td>
                        <td class="row-text"> {{ toDate(trust.createdDate.toNumber()) }} </td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    </div>
    </div>

    <!-- 
        Modals
    --> 
    <EditTrust :show="isEditDialogVisible" :trust="trustToEdit" @save="onSave" @cancel="onCancelEdit" @delete="onDelete" @withdraw="onWithdraw" @deposit="onDeposit">
        <template v-slot:title>Trust Fund: {{ selectedTrust.name }}</template>
    </EditTrust>

</div>
</div>

</template>

<script setup="props" lang="ts">
import { onMounted, ref, inject } from 'vue';
import { ethers } from 'ethers';
import { BigNumber } from '@ethersproject/bignumber'

import BlockchainConnect from '../services/BlockchainConnect';
import TrustList from '../services/TrustList';
import CurrencyExchange from '../services/CurrencyExchange';

import Button from './Button.vue'
import EditTrust from './EditTrust.vue'

import Account from '../services/Account';

import { Trust, TypeStrings, TrustType } from "../services/Trust";
import { shortenAddress, toEther, toDate, round} from '../services/Helpers';

// BLOCKCHAIN connection and prep
let bc: BlockchainConnect | undefined = inject("BlockchainConnect");
const exchange: CurrencyExchange | undefined = inject('exchange');

let list: TrustList = new TrustList();

// refs
const loaded = ref(false);
let selectedTrust = ref<Trust>({});
const showEdit = ref(false);

const show = () => showEdit.value = !showEdit.value;
const selected = (key: string) : boolean => key === selectedTrust.value.key;
const canWithdraw = ref(false);

const account = ref("");
const namedAccounts: Map<string, Account> = new Map();

/**
 * METHODS
 */
const mounted = onMounted(() => connect());

const connect = async () => {
    
    loaded.value = false;

    // Setup some default test accounts
    namedAccounts.set('grantor', new Account('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'));
    namedAccounts.set('trustees', new Account('0x70997970C51812dc3A010C7d01b50e0d17dc79C8'));
    namedAccounts.set('beneficiaries', new Account('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'));

    await bc!.connect();

    if(bc!.signer) {
        account.value = bc!.account;

        await list.connect(bc!.signer);

        bc!.setOnChange((_account: string) => account.value = _account); 

        await list.getTrusts(trust => true);

        loaded.value = true;
    }
    else 
        console.error("BC::connect() - Unable to connect to blockchain");

}

/**
 * Edit Handlers
 */

//
// Edit handlers
//
const isEditDialogVisible = ref(false);

let trustToEdit = ref(new Trust());

const onEdit = () => { 
    trustToEdit.value = Object.assign({}, selectedTrust.value);
    isEditDialogVisible.value = true; 
}
const closeEditDialog = () => { isEditDialogVisible.value = false; };

const onSave = async () => { 
    closeEditDialog(); 
    await list.updateTrust(trustToEdit.value);

}
const onCancelEdit = () => { 
    closeEditDialog(); 
};

const onWithdraw = async (amount: number) => {
    closeEditDialog();

    console.log("onWithdraw", trustToEdit.value);
    
    await list.withdraw(trustToEdit.value.key, ethers.utils.parseEther(amount.toString()));
    
}
const onDelete = async () => { 
    closeEditDialog();

    console.log("OnDelete", trustToEdit.value.key);

    await list.deleteTrust(trustToEdit.value.key);
}

const onDeposit = async (amount: number) => {
    closeEditDialog();    

    await list.deposit(trustToEdit.value.key, ethers.utils.parseEther(amount.toString()));

}  

/*
 OTHER Handlers
*/
const createTrust = async () => {

    let newTrust: Trust = new Trust();
    
    newTrust.key = "0x0";
    newTrust.beneficiaries[0] = namedAccounts.get('beneficiaries')!.address;
    newTrust.trustees[0] = namedAccounts.get('trustees')!.address;
    newTrust.trustees[1] = namedAccounts.get('beneficiaries')!.address;
    newTrust.grantor = namedAccounts.get('grantor')!.address;
    newTrust.etherAmount = ethers.utils.parseEther("1");
    newTrust.trustType = TrustType.REVOKABLE;
    let now = new Date("8/16/2022");
    let timestamp = Math.round(now.getTime() / 1000)
    console.log(now.getTime(), timestamp);
    newTrust.maturityDate = BigNumber.from(timestamp);
    newTrust.name = "Revokable Trust";
    console.log("Creating Trust: ")
    await list.createTrust(newTrust);

    newTrust.trustType = TrustType.IRREVOKABLE;
    newTrust.name = "Irrevokable";

    await list.createTrust(newTrust);

}

const getTrusts = async () => {
    list.getTrusts((trust: Trust) => { return true; });
}


const onSelectItem = async (trust: Trust) => {
    Object.assign(selectedTrust.value, trust);
    console.log("Item Selected: " + shortenAddress(selectedTrust.value.key));
    
    let returnVal = { result: false, reason: ""};

    returnVal = await list.canWithdraw(selectedTrust.value.key, bc.account); 
    
    canWithdraw.value = returnVal.result;

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
