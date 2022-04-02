
<template>
<div class="rounded-lg bg-white dark:bg-slate-800 dark:border-gray-600 shadow-lg cursor-pointer hover:border-gray-500 hover:text-gray-600 dark:hover:border-gray-400 dark:hover:text-gray-300 border relative" 
    :class="[list.creating(trust.key) ? 'animate-pulse border-green-300 border-4' : 'border-gray-300',
            list.updating(trust.key) ? 'animate-pulse border-blue-300 border-4' : 'border-gray-300',
            list.deleting(trust.key) ? 'animate-pulse border-red-300 border-4' : 'border-gray-300`']" 
        >
    <!-- Main Body -->
    <div class="p-4 sm:justify-between">
        <div class="sm:flex sm:items-center sm:space-x-5">
            <div class="items-center justify-center flex sm:shrink-0">
                <TrustCert class="" :trust="trust">
                </TrustCert>
            </div>
            <div class="mt-3 sm:place-self-start sm:flex-col text-center space-y-2.5 sm:space-y-1.5 sm:-mt-1 sm:text-left">
                <div class="text-xl underline font-bold sm:text-2xl">
                    {{ trust.name ? trust.name : "(Unnamed)" }}
                </div>
                <p class="text-sm font-medium dark:text-gray-300">
                    For Beneficiary Account #: <AddressField class="whitespace-nowrap" :address="trust.beneficiary"/> 
                </p>
                <div class="text-sm font-medium dark:text-gray-300">
                    Trust Identification #: <AddressField :etherscan="false" :address="trust.key" class="text-gray-900 dark:text-gray-300"/>
                </div>

                <p class="text-sm font-medium dark:text-gray-300">
                    Created by Account #: <AddressField :address="trust.grantor"/> 
                </p>
                <p class="text-sm font-medium dark:text-gray-300">
                    Created on: {{ trust.getCreatedDate().toLocaleDateString() }}
                </p>
                <p v-if="trust.trustees.length==1" class="text-sm font-medium dark:text-gray-300"> 
                    1 Trustee Assigned
                </p>
                <p v-else-if="trust.trustees.length > 1" class="text-sm font-medium">
                    {{ trust.trustees.length }} Trustee's assigned 
                </p>
                <p v-else-if="trust.trustees.length === 0" class="text-sm font-medium text-red-600">
                    No Trustee's assigned 
                </p>
                <div class="text-sm font-medium dark:text-gray-300">
                    Trust Type:<span class="p-1.5 text-sm rounded-lg" :class="[trust.getTypeString() === 'Revocable' ? '' : '']"> {{ trust.getTypeString() }}</span>
                </div>
            </div>
        </div>
        <div v-if="updatingText != ''" class="bg-white text-center rounded-full p-2 text-sm z-50; mt-2 sm:mt-0 flex space-x-2" 
                :class="updatingClass">
            <div class="rounded animate-spin ease duration-300 w-4 h-4 border-2"
                :class="updatingClass"></div>
            <span>{{ updatingText }}</span>
        </div>
    </div>

    <div class="border-t text-center text-gray-600 dark:text-gray-200 rounded-b-md border-gray-200 dark:border-gray-500 items-center bg-slate-100 dark:bg-slate-700 divide-y divide-gray-200 dark:divide-gray-400 sm:flex sm:divide-y-0 sm:divide-x">
        <div class="flex-1 shrink-0 p-3 text-sm font-medium">
            Amount:
            <span class="text-gray-900 dark:text-gray-300">{{etherAmount}}</span>
        </div>
        
        <div v-if="!available" class="flex-1 p-3 text-gray-900 dark:text-gray-300 text-sm font-medium">
            Available After:
            <span>{{trust.getMaturityDate().toLocaleDateString()}}</span>
        </div>
        <div v-else-if="available" class="flex-1 p-3 text-sm font-medium">
            <span class="">Available Now!</span>
        </div>
    </div>
</div>
</template>

<script setup="props, {emit}" lang="ts">
import { computed } from 'vue';

// 3rd party Components
import { ChevronRightIcon } from '@heroicons/vue/outline'

// components
import TrustCert from './TrustCert.vue'
import AddressField from './AddressField.vue'

// services
import Trust from '../services/Trust';
import { useTrustList } from '../services/TrustList';
import { useCurrencyExchange } from '../services/CurrencyExchange';
import * as utils from '../services/Utils';

const exchange = useCurrencyExchange();

const props = defineProps({
    trust: { type: Trust, required: true },
});
const emit = defineEmits(['onclick']);

const list = useTrustList();

const usd = computed(() => exchange.wei2usd(props.trust.etherAmount));
const etherAmount = computed(() => {
    return utils.toEtherStringRounded(props.trust.etherAmount) + " ETH (" + usd.value + ")";
})
const available = computed(() => {
    const today = new Date();
    const maturity = new Date(props.trust.maturityDate.toNumber() * 1000)
    return maturity < today;
});
const stats = [
  { label: 'Trust ID:', value: utils.shortenAddress(props.trust.key) },
  { label: 'Amount: ', value: etherAmount.value},
  { label: 'Available On: ', value: props.trust.getMaturityDate().toLocaleDateString() },
]
const updatingInfo = [
    { text: "", class: "" },
    { text: "Updating...", class: "text-blue-500" },
    { text: "Deleting...", class: "border-red-500 text-red-500" },
    { text: "Creating...", class: "border-green-500 text-green-500" },
];
const updatingText = computed(() => updatingInfo[list.trustState(props.trust.key)].text);
const updatingClass = computed(() => updatingInfo[list.trustState(props.trust.key)].class);

</script>
