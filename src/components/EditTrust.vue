<!--
    Dialog used to edit a trust settings.

    Handles edit of editable settings, deposit, withdraw, delete.  All actions taken through caller
    upon emitted events.

    Caller passes in a temporary trust object which can be discarded on Cancel/Close

--> 
<template>
    <Modal :open="open" @cancel="onCancel">
        <template v-slot:title>
            <slot name="title"></slot>
        </template>
        <div class="col-span-12 text-base border-gray-500 rounded-md p-2">            
            <p class="mt-1">
                <span class="-ml-2 text-green-500 text-lg flex items-center"> <svg xmlns="http://www.w3.org/2000/svg" height="32" width="32" preserveAspectRatio="xMidYMid" viewBox="-38.39985 -104.22675 332.7987 625.3605"><path fill="#343434" d="M125.166 285.168l2.795 2.79 127.962-75.638L127.961 0l-2.795 9.5z"/><path fill="#8C8C8C" d="M127.962 287.959V0L0 212.32z"/><path fill="#3C3C3B" d="M126.386 412.306l1.575 4.6L256 236.587l-128.038 75.6-1.575 1.92z"/><path fill="#8C8C8C" d="M0 236.585l127.962 180.32v-104.72z"/><path fill="#141414" d="M127.961 154.159v133.799l127.96-75.637z"/><path fill="#393939" d="M127.96 154.159L0 212.32l127.96 75.637z"/></svg>
                    {{ toEther(trust.etherAmount) }} ETH </span>
            </p>
            <p class="mt-1">Trust #: <b>{{ shortenAddress(trust.key)}}</b></p>
            <p class="mt-1">Owner: <b>{{ trust.grantor }}</b></p>
            <p class="mt-1"> Date Created: <b>{{ toDate(trust.createdDate) }}</b></p>
        </div>
        <div class="mt-5 hidden">
            <label for="tabs" class="sr-only">Select a tab</label>
            <select id="tabs" name="tabs" class="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md hover:border-indigo-500">
                <option v-for="(tab, index) in tabs" :key="index"  :selected="activeTab===index">{{ tab }}</option>
            </select>
        </div>
        <div class=" mt-5 sm:block">
            <nav class="flex space-x-4" aria-label="Tabs">
                <a v-for="(tab, index) in tabs" 
                    :key="index" 
                    :href="tab.href" 
                    :class="[activeTab===index ? 'selected-tab' : 'unselected-tab', 'tab']" 
                    :aria-current="activeTab===index ? 'page' : undefined"
                    @click="activeTab = index">
                {{ tab }}
                </a>
            </nav>
        </div>
        
        <!--
            EDIT TRUST TAB
        -->
        
        <div v-show="activeTab===0" class="tab-content">
            <form action="#" method="POST">
                <p class="text-2xl">Edit trust fund details:</p> <br/>
                <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-4 justify-self-end pt-2 ">
                        <label for="trust_name" class="label-text">Trust name</label>
                    </div>

                    <div class="col-span-8">
                        <input type="text" v-model="trust.name" name="trust_name" id="trust_name" autocomplete="trust-name" class="input-field" />
                    </div>
                    <div class="col-span-4 justify-self-end pt-2 ">
                        <label for="maturity_date" class="label-text">Maturity Date</label>
                    </div>
                    <div class="col-span-8">
                        <!--<DatePicker v-model="date"/>-->       
                        <DatePicker v-model="maturityDate" mode="date" class="flex-grow">
                            <template v-slot="{ inputValue, inputEvents }">
                                <input class="input-field"
                                    :value="inputValue"
                                    v-on="inputEvents"
                                />
                            </template>
                        </DatePicker>
                    </div>
                </div>
            </form>
            <div class="dialog-footer">
                <Button class="flex-1 btn-white mx-2" :onClick="onCancel" >
                    Cancel
                </Button>
                <Button class="flex-1 btn-primary mx-2" :onClick="onSave">
                    Save Changes
                </Button>                                                    
            </div>                               
        </div>
        
        <div v-show="activeTab===1" class="tab-content">
            <div class="flex mb-5">
                Beneficiary Account: 
                <input type="flex-grow" v-model="newBeneficiary" name="beneficiary" id="beneficiary" autocomplete="beneficiary" class="input-field" />
            </div>
            <div class="dialog-footer">
                <Button class="flex-1 btn-white mx-2" :onClick="onCancel" >
                    Cancel
                </Button>
                <Button class="flex-1 btn-primary mx-2" :onClick="onSave">
                    Save Changes
                </Button>                                                    
            </div>                               
        </div>      
        <div v-show="activeTab===2" class="tab-content">
            <div class="flex mb-5">
                <input type="flex-grow text-sm" v-model="newTrustee" name="trustee" id="trustee" autocomplete="trustee" class="input-field" />
                <Button class="flex-shrink-0 ml-4 btn-success" @click="addTrustee()">Add Trustee</Button>
            </div>
            <ul class="border shadow border-gray-200 min-w-full divide-y divide-gray-200">
                <div class="bg-gray-100">
                    <div class="p-2">Trustee Addresses</div>
                </div>
                <div class="overflow-y-auto bg-white divide-y divide-gray-200" style="height: 16vh;">
                    <li v-for="trustee in trust.trustees" :key="trustee" class="mx-3 py-2 flex">
                        <div class="flex-grow text-sm font-medium text-gray-900">{{ trustee }}</div>
                        <button @click="deleteTrustee(trustee)"><XIcon class="mr-2 text-gray-700 hover:text-red-500 flex-shrink h-4 w-4" aria-hidden="true"  /></button>                
                    </li>
                </div>
            </ul>
            <div class="dialog-footer">
                <Button class="flex-1 btn-white mx-2" :onClick="onCancel" >
                    Cancel
                </Button>

                <Button class="flex-1 btn-primary mx-2" :onClick="onSave">
                    Save Changes
                </Button>                                                    
            </div>                               
        </div>      

        <!--
            WITHDRAW FUNDS TAB
        -->
        <div v-show="activeTab===3" class="tab-content">
            <div v-if="!canWithdraw">
            You cannot withdraw funds from this trust fund type: {{trust.trustType}}
            </div>
            <div v-else>
                <p class="text-2xl">Withdraw funds from trust-fund:</p><br/>

                <p><b>Note: Funds will be returned to the owner of the trust.  Only the trust fund owner may withdraw. </b></p><br/>
                <p>Maximum withdrawal: 
                    <span class="text-green-500">{{toEther(trust.etherAmount)}} ETH</span>
                </p>
                <div class="grid grid-cols-12 mt-4 gap-6 items-center">
                    <div class="col-span-12">
                        <EthInput v-model="ethWithdraw">Enter Amount to withdraw</EthInput>
                    </div>
                </div>

                <div class="dialog-footer">
                    <Button class="flex-1 btn-white mx-2" :onClick="onCancel" >
                        Cancel
                    </Button>
                    <Button class="flex-1 btn-success" :onClick="onWithdraw">Withdraw Funds</Button>
                </div>
            </div>
        </div>
        <!--
            ADD FUNDS TAB
        -->
        <div v-show="activeTab===4" class="tab-content">
            <p class="text-2xl">Add funds to trust fund. </p> <br/>
            <p><b>Note: Only ETH deposits are supported at this time.</b></p><br/>
            <p class="text-xl">Your Wallet Balance: <span class="text-bold text-green-600"> TODO: INSERT BAL ETH</span></p>

            <EthInput class="mt-3" v-model="ethDeposit">Deposit Amount</EthInput>

            <div class="dialog-footer">
                <Button class="flex-1 btn-white mx-2" :onClick="onCancel" >
                    Cancel
                </Button>
                <Button class="flex-1 btn-success" :onClick="onDeposit">
                    Deposit
                </Button>
            </div>

        </div>
        <!--
            DELETE TRUST TAB
        -->
        <div v-show="activeTab===5" class="tab-content">
            <div class="text-2xl">Delete trust fund? </div> <br/>
            <div class="text-xl">Trust Fund Balance is <span class="text-bold text-green-600">{{ toEther(trust.etherAmount) }} ETH</span></div><br/>
            <div class="font-bold">Deleting this trust fund will transfer {{ toEther(trust.etherAmount) }} ETH to address: <br/><br/> </div> 
            <div class="leading-tight text-center">{{trust.grantor}}</div>
            <div class="dialog-footer">

                <Button class="flex-1 btn-white mx-2" :onClick="onCancel" >
                    Cancel
                </Button>
                <Button class="flex-1 btn-danger mx-2" :onClick="onDelete" >
                    Delete Trust
                </Button>
            </div>
        </div>
    </Modal>
</template>

<script setup="props, {emit}" lang="ts">
import { ref, onUpdated, onBeforeMount, defineProps } from 'vue'
import { ethers } from 'ethers';
import { DatePicker } from 'v-calendar';
import { XIcon } from '@heroicons/vue/solid';

import { BigNumber} from "@ethersproject/bignumber";
import { Trust } from '../services/Trust'
import Modal from './Modal.vue';
import Button from './Button.vue';
import EthInput from './EthInput.vue';

import { toDate, toEther, shortenAddress } from '../services/Helpers';

const props = defineProps({
    trust: Trust,
    canWithdraw: Boolean,
});

const activeTab = ref(0);
const tabs = ref([
          "Details",
          "Beneficiary",
          "Trustees",
          "Withdraw",
          "Deposit",
          "Delete",
]);

const emit = defineEmits(['save', 'cancel', 'delete', 'withdraw', 'deposit', 'invest']);

// Variables
const open = ref(true);
const maturityDate = ref(new Date());
const ethWithdraw = ref(0);
const ethDeposit = ref(0);
const newTrustee = ref('');
const newBeneficiary = ref('');

// Methods
const onSave = () => { 
    // Validate beneficiary address
    if(!updateBeneficiary())
        return;

    open.value = false;
    props.trust!.maturityDate = BigNumber.from(maturityDate.value.getTime() / 1000);
    emit('save'); 
};
const onCancel = () => { open.value = false; emit('cancel'); };
const onDelete = () => { open.value = false; emit('delete'); };
const onWithdraw = () => { open.value = false; emit('withdraw', ethWithdraw.value); };
const onDeposit = () => { open.value = false; emit('deposit', ethDeposit.value); };

const deleteTrustee = (address: string) => { 
    let newList = [... props.trust!.trustees];
    props.trust!.trustees = [... deleteFrom(newList, address)];
}

const deleteFrom = (list: string[], address: string): string[] => {
    if(list.length == 1) {
        window.alert("You must have at least one item.")
        return list;
    }
    let index = list.findIndex(item => item === address);
    list.splice(index, 1);
    return list;
}

const addTrustee = () => {
    let index = props.trust!.trustees.findIndex(item => item === newTrustee.value);
    
    if(index != -1) {
        window.alert("Trustee already exists.")
        return;
    }
    if(!ethers.utils.isAddress(newTrustee.value)) {
        window.alert("Invalid Address.");
        return;
    }
    if(newTrustee.value === props.trust!.grantor) {
        window.alert("Trustee cannot be the same account as grantor.");
        return;
    }
    if(-1 !== props.trust!.beneficiaries.findIndex(item => item === newTrustee.value)) {
        window.alert("Trustee cannot also be a beneficiary.");
        return;
    }

    let trustees = [... props.trust!.trustees];
    trustees.push(newTrustee.value);
    newTrustee.value = "";
    props.trust!.trustees = [... trustees];
}

const updateBeneficiary = (): boolean => {
    if(!ethers.utils.isAddress(newBeneficiary.value)) {
        window.alert("Invalid Address.");
        return false;
    }
    if(newBeneficiary.value === props.trust!.grantor) {
        window.alert("Beneficiary cannot be the same as the Grantor.");
        return false;
    }
    if(-1 !== props.trust!.trustees.findIndex(item => item === newBeneficiary.value)) {
        window.alert("Beneficiary cannot also be a trustee.");
        return false;
    }
    props.trust!.beneficiaries = [newBeneficiary.value];
    return true;
}

const updated = onUpdated(() => { 
    maturityDate.value = new Date(props.trust!.maturityDate.toNumber() * 1000); 
    newBeneficiary.value = props.trust!.beneficiaries[0];
});

</script>

<style scoped>

.screen-overlay {
    @apply fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity;
}    
.dialog-window {
    @apply inline-block align-bottom bg-white rounded-2xl px-4 pt-5 pb-4 sm:max-w-3xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full sm:p-6;
}
.dialog-icon {
    @apply mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10;
}
.dialog-title {
    @apply text-2xl leading-6 text-gray-900;
}
.dialog-footer {
    @apply flex mt-6 px-4 py-3 text-right;
}
.input-field {
    @apply  text-base p-2 block border focus:ring-indigo-500 focus:border-indigo-500 w-full min-w-0 rounded-md border-gray-300;
}
.label-text {
    @apply block text-left text-lg font-medium text-gray-700;
}
.tab {
    @apply px-3 py-2 font-medium text-lg rounded-md;
}
.selected-tab {
    @apply cursor-pointer text-white bg-black rounded-md;
}
.unselected-tab {
    @apply cursor-pointer border border-white text-gray-700 hover:text-indigo-500 hover:border-indigo-500;
}
.tab-content {
    @apply border-gray-400 text-xl mt-2 border rounded-md pt-6 px-6 pb-2;
}
</style> 
