<template>
<div>
    <ConnectBlock v-if="bc.connectionState.value !== state.Connected" />

    <div v-else-if="bc.connectionState.value === state.Connected && !trusts">
        <div class="flex h-20 justify-center items-center">
            <div class="rounded animate-spin ease duration-300 w-5 h-5 border-2 border-black dark:border-white">
            </div><span class="ml-2">Fetching your Trusts...</span>
        </div>        
    </div>
    <div v-else-if="bc.connectionState.value === state.Connected && trusts" class="text-center ">
        <PageTitle>
            <template v-slot:title>For you as Trustee: 
                <span class="text-gray-500 text-base">
                    (<AddressField :address="bc.account.value"></AddressField>)
                </span>
            </template>
        </PageTitle> 
        
        <div v-if="trusts && !trusts.length" class=" m-10 mt-10 flex justify-center " >
            <GuidanceCard class="w-[95%] sm:w-full sm:max-w-md"
                        title="Can't find a trust for you as Trustee" >
                <template v-slot:body>
                    <p> 
                        We searched for a trust fund with account <AddressField v-if="bc.account" :address="bc.account.value"></AddressField> listed as a trustee and couldn't find one.
                    </p>
                    <p>
                        If you believe there should a trust for you as a trustee, double check your account information
                        and check with the trust creator to ensure that you've connected your wallet to the same
                        address they listed for you as Trustee.                   
                    </p>
                </template>
                <template v-slot:buttons> 
                    <button v-if="true" class="btn btn-rounded shrink-0 btn-primary" @click="$router.push('/About')">Learn More</button>
                </template>
            </GuidanceCard>
        </div>

        <div v-else-if="trusts && trusts.length" class="p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">

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
</div>
</template>
    
<script setup="props" lang="ts">
import { computed, ref, inject } from 'vue';
import { ethers } from 'ethers';

// components
import EditTrust from './EditTrust.vue';
import NewTrustCard from './TrustCard.vue';
import PageTitle from './PageTitle.vue';
import AddressField from './AddressField.vue'
import ConnectBlock from './BlockchainConnectHelp.vue'
import GuidanceCard from './GuidanceCard.vue'

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
const state = ConnectionState;
const list = useTrustList();

const trusts = computed(() => 
    list.trusts.value?.filter(trust => 
        -1 !== trust.trustees.findIndex(trustee => 
            trustee.toUpperCase() === bc.account.value.toUpperCase()
        )
    )
);
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
