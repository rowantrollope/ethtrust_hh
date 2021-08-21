<template>
<div v-if="bc.loaded">
<div class="text-center ">
    <div class="flex mt-5 justify-center">
        <button class="text-base mx-2 font-normal bg-green-500 rounded-lg text-white hover:bg-green-300 p-2" :onClick="createTrust">CREATE</button>
        <Button v-if="selectedTrust.key" class="btn btn-primary" :onClick="onEdit">EDIT</Button>        <button class="text-base mx-2 font-normal bg-indigo-500 rounded-lg text-white hover:bg-indigo-300 p-2" :onClick="testMethod">TEST</button>
        <InputTrustType v-model="selectedTrust"></InputTrustType>
    </div>
    <!-- Account list -->
    <div class="text-sm text-black px-7 mt-5">
    <div class="mt-5 flex flex-col">
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
                        :class="[selected(trust.key) ? 'bg-blue-100' : '', 
                                list.creating(trust.key) ? 'animate-pulse text-green-500' : 'text-gray-900',
                                list.updating(trust.key) ? 'animate-pulse text-blue-500' : 'text-gray-900',
                                list.deleting(trust.key) ? 'animate-pulse text-red-500' : 'text-gray-900']" 
                        @click="select(trust.key)">
                        <td class="row-text text-blue-600">
                            <AddressField :address="trust.key"/>
                        </td>
                        <td class="row-text"> {{ trust.name }} </td>
                        <td class="row-text"> {{ TypeStrings[trust.trustType] }} </td>
                        <td class="row-text"> <AddressField :address="trust.grantor"/> </td>
                        <td class="row-text"> 
                            <div v-for="trustee in trust.trustees" :key="trustee"><AddressField :address="trustee"/>, </div>
                        </td>
                        <td class="row-text"> 
                            <AddressField :address="trust.beneficiary"/>
                        </td>
                        <td class="row-text"> {{ ethers.utils.commify(toEther(trust.etherAmount)) }} </td>
                        <td class="row-text"> {{ trust.getMaturityDate().toLocaleDateString() }} </td>
                        <td class="row-text"> {{ trust.getCreatedDate().toLocaleDateString() }} </td>
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
    <EditTrust :show="showEditDialog"
                :reason="reason"
                :canWithdraw="canWithdraw" 
                v-model="selectedTrust" 
                @save="onSave" 
                @cancel="onCancelEdit" 
                @delete="onDelete" 
                @withdraw="onWithdraw" 
                @deposit="onDeposit">
        <template v-slot:title>Trust Fund: {{ selectedTrust.name }}</template>
    </EditTrust>

</div>
</div>

</template>

<script setup="props" lang="ts">
import { onMounted, ref, inject, watch } from 'vue';
import { ethers } from 'ethers';
import { BigNumber } from '@ethersproject/bignumber'

import BlockchainConnect from '../services/BlockchainConnect';
import TrustList from '../services/TrustList';
import CurrencyExchange from '../services/CurrencyExchange';

import AddressField from './AddressField.vue';
import Button from './Button.vue'
import EditTrust from './EditTrust.vue'
import InputTrustType from './InputTrustType.vue'
import NewTrustCard from './NewTrustCard.vue'

import { Trust, TypeStrings, TrustType } from "../services/Trust";
import { shortenAddress, toEther, toDate, toEtherStringRounded } from '../services/Helpers';

// BLOCKCHAIN connection and prep
const exchange = <CurrencyExchange> inject('exchange');

/**
 * LOAD BC DATA
 */
let bc = <BlockchainConnect> inject("BlockchainConnect");
const list = <TrustList> inject("TrustList");

/**
 * List select handlers
 */

const selected = (key: string) : boolean => key === selectedTrust.value.key;

const selectEdit = (key: string) => {
    select(key);
    onEdit();
}
const select = (key: string) => {
    
    const index = list.trusts.value!.findIndex(item => item.key === key);
    if(index !== -1)
        selectedTrust.value.clone( list.trusts.value![index] );
    else 
        console.error("Can't find trust key: ", key);

    console.log("Selected", selectedTrust.value.key);
}

const testMethod = () => {
}
/**
 * Edit Handlers
 */
const showEditDialog = ref(false);
const closeEditDialog = () => showEditDialog.value = false;
const openEditDialog = () => showEditDialog.value = true;
const canWithdraw = ref(false);
const reason = ref("");
let selectedTrust = ref(new Trust());

const onEdit = async () => { 
    
    list.canWithdraw(selectedTrust.value.key, bc!.account.value).then((arg) => {
        canWithdraw.value = arg.result;
        reason.value = arg.reason;
        openEditDialog();
    })
}

const onSave = async () => { 
    console.log("onSave");
    closeEditDialog();
    await list.updateTrust(selectedTrust.value);
}

const onCancelEdit = () => closeEditDialog(); 

const onWithdraw = async (amount: number) => {
    closeEditDialog();
    await list.withdraw(selectedTrust.value.key, ethers.utils.parseEther(amount.toString()));    
    await list.updateTrust(selectedTrust.value);
}

const onDelete = async () => { 
    closeEditDialog();
    await list.deleteTrust(selectedTrust.value.key);
}

const onDeposit = async (amount: number) => {
    closeEditDialog();    
    await list.deposit(selectedTrust.value.key, ethers.utils.parseEther(amount.toString()));
    await list.updateTrust(selectedTrust.value);
}  

/*
 Create new Trust
*/

const hh_accounts = [
    "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
    "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
    "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65",
    "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc",
    "0x976ea74026e726554db657fa54763abd0c3a0aa9",
    "f",
    "0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f",
    "0xa0ee7a142d267c1f36714e4a8f75612f20a79720",
    "0xbcd4042de499d14e55001ccbb24a551f3b954096",
];

const createTrust = async () => {

    let newTrust: Trust = new Trust();
    
    newTrust.key = "0x0";
    newTrust.grantor = hh_accounts[0];
    newTrust.beneficiary = hh_accounts[1];
    newTrust.addTrustee(hh_accounts[2]);
    newTrust.addTrustee(hh_accounts[3]);
    newTrust.etherAmount = ethers.utils.parseEther("1");
    newTrust.trustType = TrustType.REVOKABLE;
    let now = new Date("8/16/2022");
    let timestamp = Math.round(now.getTime() / 1000)
    console.log(now.getTime(), timestamp);
    newTrust.maturityDate = BigNumber.from(timestamp);
    newTrust.name = "Revokable Trust";
    console.log("Creating Trust: ")
    await list.createTrust(newTrust);

    newTrust.key = "0x0";
    newTrust.trustType = TrustType.IRREVOKABLE;
    newTrust.name = "Irrevokable";

    await list.createTrust(newTrust);

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
