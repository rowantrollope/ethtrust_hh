<template>
<div v-if="loaded && trusts">

    <div v-if="!trusts.length">
        <h1 class="text-3xl mt-10 ml-5 tracking-tight font-thin text-gray-900 sm:text-5xl md:text-6xl">
            <span class="block inline">Let's make your first Trust fund </span>
            <div class="flex items-center space-x-5 mt-10 ml-10 ">
                <span class="block text-3xl sm:text-3xl md:text-5xl text-indigo-600">Click </span>
                <Button class="btn-rounded text-3xl sm:text-3xl md:text-5xl btn-primary" @click="$emit('create-clicked')">Create New</Button>
                <span class="block text-3xl sm:text-3xl md:text-5xl text-indigo-600">to begin</span>
            </div>
        </h1>
    </div>

    <div v-else-if="trusts.length"> 
        <Stats :trusts="trusts"/>
        <div class="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
            <transition-group name="list">
                <NewTrustCard v-for="trust in trusts" :key="trust.key" :trust="trust" @click="select(trust.key)"/>
            </transition-group>
            <!-- Create Trusts Item -->
            <div class="create-new-card hover:border-white p-20 hover:shadow-lg text-gray-300  hover:text-indigo-500" @click="$emit('create-clicked')">
                <div class="flex-shrink rounded-lg text-center text-xl "> Create New Trust</div>
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

</template>

<script setup="props" lang="ts">
import { computed, ref, inject } from 'vue';
import { ethers } from 'ethers';
import { BigNumber } from '@ethersproject/bignumber'

import BlockchainConnect from '../services/BlockchainConnect';
import TrustList from '../services/TrustList';
import CurrencyExchange from '../services/CurrencyExchange';

import Stats from './Stats.vue';
import Button from './Button.vue';
import EditTrust from './EditTrust.vue';
import NewTrustCard from './NewTrustCard.vue';

import { Trust } from "../services/Trust";

// BLOCKCHAIN connection and prep
const exchange = <CurrencyExchange> inject('exchange');

/**
 * LOAD BC DATA
 */
let bc = <BlockchainConnect> inject("BlockchainConnect");
const list = <TrustList> inject("TrustList");
const loaded = inject("loaded");
const trusts = computed(() => list.trusts.value?.filter(trust => trust.grantor.toUpperCase() === bc.account.value.toUpperCase() ));

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

    onEdit();
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

</script>

<style scoped>
   .create-new-card {
        @apply cursor-pointer 
            border-2 
            border-dashed
            border-gray-300 
            rounded-lg 
            h-48 
            hover:text-indigo-500
            hover:shadow-md
            hover:border-white
            hover:bg-gray-100
    };


.list-enter-active,
.list-leave-active,
.list-move {
  transition: 500ms cubic-bezier(0.59, 0.12, 0.34, 0.95);
  transition-property: opacity, transform;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(50px) scaleY(0.5);
}

.list-enter-to {
  opacity: 1;
  transform: translateX(0) scaleY(1);
}

.list-leave-active {
  position: absolute;
}

.list-leave-to {
  opacity: 0;
  transform: scaleY(0);
  transform-origin: center top;
}

</style>
