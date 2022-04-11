<template>
<div>

    <div v-if="bc.connectionState.value === state.Connected && !trusts">
        <div class="flex h-20 justify-center items-center">
            <div class="rounded animate-spin ease duration-300 w-5 h-5 border-2 border-black dark:border-white">
            </div><span class="ml-2">Fetching your Trusts...</span>
        </div>        
    </div>
    <div v-else-if="bc.connectionState.value === state.Connected && trusts">
        <div v-if="trusts.length" class=""> 
            <div v-if="trusts.length === 1">
                <div class=" pb-5 flex dark:bg-slate-900 
                            sm:mt-5 sm:bg-white sm:dark:bg-slate-900 sm:overflow-auto sm:flex-col sm:space-y-3 sm:h-auto sm:-mr-2 sm:-ml-2
                            sm:grid sm:grid-cols-1 lg:grid-cols-2 sm:gap-4 sm:mb-5 sm:space-x-0 lg:space-y-0">

                    <div v-for="trust in trusts" :key="trust.key" class="snap-center px-10 grow">  
                    <transition-group name="list">
                        <TrustCard class="" :trust="trust" @click=" select(trust.key)"/>
                    </transition-group>
                    </div> 

                </div>                
            </div>
            <div v-else>
            <Stats class="sm:mb-5" :trusts="trusts"/>
                <div class="-ml-5 -mr-5 pb-5 px-10 snap-x snap-mandatory overflow-x-auto h-full flex space-x-3 dark:bg-slate-900
                            sm:mt-5 sm:px-2 sm:bg-white sm:dark:bg-slate-900 sm:overflow-auto sm:flex-col sm:space-y-3 sm:h-auto sm:-mr-2 sm:-ml-2
                            sm:grid sm:grid-cols-1 lg:grid-cols-2 sm:gap-4 sm:mb-5 sm:space-x-0 lg:space-y-0">

                    <div v-for="trust in trusts" :key="trust.key" class="snap-center shrink-0">  
                    <transition-group name="list">
                        <TrustCard class="w-[100%]" :trust="trust" @click=" select(trust.key)"/>
                    </transition-group>
                    </div> 
                </div>
            </div>


            <div v-if="false" class="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
                <transition-group name="list">
                    <TrustCard class="snap-center" v-for="trust in trusts" :key="trust.key" :trust="trust" @click="select(trust.key)"/>
                </transition-group>
            </div>

            <EditTrust  :show="showEditDialog"
                        :reason="reason"
                        :canWithdraw="canWithdraw" 
                        v-model="selectedTrust" 
                        @save="onSave" 
                        @cancel="onCancelEdit" 
                        @delete="onDelete" 
                        @withdraw="onWithdraw" 
                        @deposit="onDeposit">
                <template v-slot:title>{{ selectedTrust.name }}</template>
            </EditTrust>
        </div>
        <div v-else-if="!trusts.length">
            <div class="flex justify-center">

                <div class="flex-col space-y-4 dark:bg-slate-700 bg-white justify-center text-center p-4 rounded-xl w-[60%] max-w-sm shadow-sm
                            hover:shadow-lg hover:scale-[1.01] transition-all duration-400 transform ease-in-out relative">
                    <h1 class="font-bold mt-5 text-2xl">
                        Let's create your first trust fund.
                    </h1>
                    <div>
                        You'll be walked through 5 simple steps to create your first trust fund.
                    </div>
                    <button v-if="true" class="btn btn-rounded shrink-0 btn-primary" @click="$emit('create-clicked')">Get Started</button>
                    <div class="flex-shrink-0 rounded-xl p-10 flex items-center justify-center">
                        <img class="" alt="cert" src="../assets/certificate.png">
                    </div>
                </div>

            </div>

            <h1 v-if="false" class="text-lg mt-10 ml-5 md:text-xl">
                <div class="text-center items-center mt-5 ml-5 ">
                    <span class="shrink-0">Creating your first trust fund is simple! </span>
                    <span> Let's get started: </span> 
                    <button v-if="true" class="btn animate-pulse btn-rounded shrink-0 btn-primary" @click="$emit('create-clicked')">Create New</button>
                    <span v-if="false" class="ml-1 whitespace-nowrap">to begin</span>
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
import ConnectBlock from './BlockchainConnectHelp.vue';

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
