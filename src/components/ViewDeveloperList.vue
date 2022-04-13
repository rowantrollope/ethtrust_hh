<template>
<div v-if="bc.connectionState.value === bcState.Connected" class="text-center ">
    <div v-show="false" class="mb-5 w-full p-2 bg-red-200 text-red-600"><span class="animate-pulse">Warning: Don't mess with this stuff bro.</span></div>
    <div class="flex ml-6 space-x-2 mt-5 items-center">
        <button class="text-base font-normal bg-green-500 rounded-lg text-white hover:bg-green-300 p-2" :onClick="createTrust">CREATE</button>
        <div class="grow"></div>
        <div><TextToggle v-model="toggleOn" :color-on="'bg-blue-500'" 
                    :color-off="'bg-blue-500'" 
                    :text-on="'Flat list'" 
                    :text-off="'Cards'">View: </TextToggle> </div>
        <div> Filter: <input class="border p-1 rounded-md dark:text-black" v-model='query' placeholder="Trust Name..."></div>
    </div>
    
    <div class="slider">

    <Transition :name="slideClass">
    <div v-show="!toggleOn" class="w-full snap-x snap-mandatory overflow-x-auto h-full flex space-x-4 p-4">

        <div v-for="trust in filteredTrusts" :key="trust.key" class="snap-center shrink-0">  
            <TrustCard class="w-[100%]" :trust="trust" @click=" select(trust.key)"/>
        </div> 

    </div>
    </Transition>
    <Transition :name="slideClass">
   <div v-show="toggleOn" class="w-full text-sm px-1 mt-5">
    <div class="mt-5 flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50 dark:bg-slate-700">
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

                    <tr v-for="trust in filteredTrusts" :key="trust.key" 
                        class=" hover:bg-blue-100 hover:dark:bg-slate-700 hover:dark:text-white hover:cursor-pointer"
                        :class="[selected(trust.key) ? 'bg-blue-100 dark:bg-slate-700' : '', 
                                list.creating(trust.key) ? 'animate-pulse text-green-500' : 'text-gray-900',
                                list.updating(trust.key) ? 'animate-pulse text-blue-500' : 'text-gray-900',
                                list.deleting(trust.key) ? 'animate-pulse text-red-500' : 'text-gray-900']" 
                        @click="select(trust.key)">
                        <td class="row-text text-blue-600">
                            <AddressField :address="trust.key"/>
                        </td>
                        <td class="row-text" :class="[trust.name.toLowerCase().includes(query.toLowerCase()) ? 'dark:text-green-500' : '']"> {{ trust.name }} </td>
                        <td class="row-text"> {{ TypeStrings[trust.trustType] }} </td>
                        <td class="row-text"> <AddressField :address="trust.grantor"/> </td>
                        <td class="row-text"> 
                            <div v-for="trustee in trust.trustees" :key="trustee"><AddressField :address="trustee"/>, </div>
                        </td>
                        <td class="row-text"> 
                            <AddressField :address="trust.beneficiary"/>
                        </td>
                        <td class="row-text"> {{ ethers.utils.commify(utils.toEther(trust.etherAmount)) }} </td>
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
</Transition>
</div>
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
import { ref, computed, watch } from 'vue';
import { ethers } from 'ethers';
import { BigNumber } from '@ethersproject/bignumber'
import { DatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css';

// components
import AddressField from './AddressField.vue';
import EditTrust from './EditTrust.vue'
import InputTrustType from './InputTrustType.vue'
import TrustCard from './TrustCard.vue'
import TextToggle from './TextToggle.vue'

// services
import { useBlockchainConnect, ConnectionState } from '../services/BlockchainConnect';
import { useTrustList } from '../services/TrustList';
import Trust, { TypeStrings, TrustType } from "../services/Trust";
import * as utils from '../services/Utils';

const slideClass=ref('slide-left');
const toggleOn=ref(false);

watch(toggleOn, () => {
    slideClass.value = toggleOn.value ? 'slide-right' : 'slide-left';
});

// BLOCKCHAIN connection and prep
const bcState = ConnectionState;
/**
 * LOAD BC DATA
 */
const bc = useBlockchainConnect();
const list = useTrustList();

const tomorrow = new Date();
const maturityDate = ref(new Date());

const query = ref('');
const filteredTrusts = computed(() => 
  query.value === ''
      ? list.trusts.value
      : list.trusts.value?.filter((trust) => {
          return trust.name.toLowerCase().includes(query.value.toLowerCase())
        })
  )
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
    newTrust.trustType = TrustType.REVOCABLE;
    let now = new Date("8/16/2022");
    let timestamp = Math.round(now.getTime() / 1000)
    console.log(now.getTime(), timestamp);
    newTrust.maturityDate = BigNumber.from(timestamp);
    newTrust.name = "Revocable Trust";
    console.log("Creating Trust: ")
    await list.createTrust(newTrust);

    newTrust.key = "0x0";
    newTrust.trustType = TrustType.IRREVOCABLE;
    newTrust.name = "Irrevocable";

    await list.createTrust(newTrust);

}

</script>

<style scoped>
    .slider {
      position: relative;
      z-index: 1;
      overflow: scroll;
      height:90vh;
    }  
    .col-header {
        @apply px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider;
    }
    .row-text {
        @apply font-medium px-1 py-3 whitespace-nowrap dark:text-white md:text-sm text-sm;
    }

    .fade-enter-active {
        transition: all 0.3s ease-out;
    }

    .fade-leave-active {
        transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
    .fade-enter-active {
        transition: all 0.3s ease-out;
    }

    .slide-left-enter-active {
        @apply transition transform ease-out duration-300;
    }
    .slide-left-enter-from {
        @apply translate-x-full opacity-50;
    }
    .slide-left-enter-to {
        @apply translate-x-0 opacity-100;
    }
    .slide-left-leave-active {
        @apply transition transform ease-in duration-300;
    }
    .slide-left-leave-from {
        @apply translate-x-0 opacity-100;
    }
    .slide-left-leave-to {
        @apply -translate-x-full opacity-50;
    }

    .slide-right-enter-active {
        @apply transition transform ease-out duration-300;
    }
    .slide-right-enter-from {
        @apply -translate-x-full opacity-50;
    }
    .slide-right-enter-to {
        @apply translate-x-0 opacity-100;
    }
    .slide-right-leave-active {
        @apply transition transform ease-in duration-300;
    }
    .slide-right-leave-from {
        @apply translate-x-0 opacity-100;
    }
    .slide-right-leave-to {
        @apply translate-x-full opacity-50;
    }


</style>
