<template>
<div>
    <ConnectBlock v-if="bc.connectionState.value !== state.Connected" />

    <div v-else-if="bc.connectionState.value === state.Connected && !trusts">
        <div class="flex h-20 justify-center items-center">
            <div class="rounded animate-spin ease duration-300 w-5 h-5 border-2 border-black">
            </div><span class="ml-2">Fetching your Trusts...</span>
        </div>        
    </div>
    <div v-else-if="bc.connectionState.value === state.Connected && trusts">
        <div v-if="trusts.length"> 
            <Stats :trusts="trusts"/>
            <div class="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
                <transition-group name="list">
                    <TrustCard v-for="trust in trusts" :key="trust.key" :trust="trust" @click="select(trust.key)"/>
                </transition-group>

                <div class=" create-new-card hidden sm:block md:block lg:hidden hover:border-white p-20 hover:shadow-lg text-gray-300  hover:text-indigo-500" @click="$emit('create-clicked')">
                    <div class="flex-shrink rounded-lg text-center text-xl "> Create New Trust</div>
                </div>
            </div>

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
        <div v-else-if="!trusts.length">
            <h1 class="text-2xl mt-10 ml-5 tracking-tight font-thin text-gray-900 sm:text-3xl md:text-4xl">
                <div class="inline">Let's make your first trust fund </div>
                <div class="flex text-center items-center space-x-3 mt-10 ml-5 ">
                    <span class="block text-xl sm:text-3xl">Click </span>
                    <button class="btn btn-rounded flex-shrink-0 text-xl sm:text-3xl btn-primary" @click="$emit('create-clicked')">Create New</button>
                    <span class="block text-xl sm:text-3xl flex-shrink-0">to begin</span>
                </div>
            </h1>
        </div>
    </div>    
</div>
</template>

<script setup="props" lang="ts">
import { computed, ref, inject } from 'vue';
import { ethers } from 'ethers';

// components
import Stats from './Stats.vue';
import EditTrust from './EditTrust.vue';
import TrustCard from './TrustCard.vue';
import ConnectBlock from './ConnectBlock.vue';

// services
import { useBlockchainConnect, ConnectionState } from '../services/BlockchainConnect';
import { useTrustList } from '../services/TrustList';
import { useCurrencyExchange } from '../services/CurrencyExchange';
import Trust from "../services/Trust";

// BLOCKCHAIN connection and prep
const exchange = useCurrencyExchange();

/**
 * LOAD BC DATA
 */
const bc = useBlockchainConnect();
const list = useTrustList();
const trusts = computed(() => list.trusts.value?.filter(trust => trust.grantor.toUpperCase() === bc.account.value.toUpperCase() ));
const state = ConnectionState;

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
}

const onDelete = async () => { 
    closeEditDialog();
    await list.deleteTrust(selectedTrust.value.key);
}

const onDeposit = async (amount: number) => {
    closeEditDialog();    
    await list.deposit(selectedTrust.value.key, ethers.utils.parseEther(amount.toString()));
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
    }


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
