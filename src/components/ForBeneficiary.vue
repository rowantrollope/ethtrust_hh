<template>
<div v-if="bc.loaded" class="text-center ">
    <PageTitle>
            <template v-slot:title>Trusts Created for You 
                <span class="text-gray-500 text-base">(<AddressField v-if="bc.account" :address="bc.account.value"></AddressField>)</span>
            </template>
    </PageTitle>  

    <div v-if="trusts && !trusts.length" class=" m-10 mt-10 " >
        <h1 class="text-4xl tracking-tight font-thin text-gray-900 sm:text-5xl md:text-6xl">
            <span class="block xl:inline">
                There arent any trust funds for you yet. 
            </span>
            <span class="block mt-10 text-indigo-600 xl:inline">Maybe later...</span>
        </h1>
    </div>

    <div v-else-if="trusts && trusts.length" class="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        There are {{ trusts.length }} trust funds for you.
        None of them are accessible yet.
        <transition-group name="list">
            <NewTrustCard v-for="trust in trusts" :key="trust.key" :trust="trust" @click="select(trust.key)"/>
        </transition-group>

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
import { ref, inject, computed } from 'vue';
import { ethers } from 'ethers';

import PageTitle from './PageTitle.vue';
import EditTrust from './EditTrust.vue';
import NewTrustCard from './NewTrustCard.vue';
import AddressField from './AddressField.vue';

import BlockchainConnect from '../services/BlockchainConnect';
import TrustList from '../services/TrustList';
import CurrencyExchange from '../services/CurrencyExchange';

import { Trust } from "../services/Trust";

// BLOCKCHAIN connection and prep
const exchange: CurrencyExchange | undefined = inject('exchange');

/**
 * LOAD BC DATA
 */
let bc = <BlockchainConnect> inject("BlockchainConnect");
const list = <TrustList> inject("TrustList");

const trusts = computed(() => list.trusts.value?.filter(trust => trust.beneficiary.toUpperCase() === bc.account.value.toUpperCase() ));

/**
 * List select handlers
 */

const selected = (key: string) : boolean => key === selectedTrust.value.key;

const select = (key: string) => {
    
    const index = list.trusts.value!.findIndex(item => item.key === key);
    if(index !== -1)
        selectedTrust.value.clone( list.trusts.value![index] );
    else 
        console.error("Can't find trust key: ", key);

    console.log("Selected", selectedTrust.value.key);
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
