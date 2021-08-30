
<template>
<div class="card" 
    :class="[list.creating(trust.key) ? 'animate-pulse border-green-300 border-4' : 'border-gray-300',
            list.updating(trust.key)  ? 'animate-pulse border-blue-300 border-4' : 'border-gray-300',
            list.deleting(trust.key) ? 'animate-pulse border-red-300 border-4' : 'border-gray-300`']" 
        >
    <h2 class="sr-only" id="profile-overview-title">Profile Overview</h2>
    <div class="p-4">
        <div class="sm:flex sm:items-center sm:justify-between">
            <div class="sm:flex sm:space-x-5">
                <div class="flex-shrink-0">
                    <TrustCert class="text-black" :trust="trust"/>
                </div>
                <div class="mt-3 text-center space-y-0.5 sm:-mt-1 sm:text-left">
                    <p class="text-xl font-bold text-gray-900 sm:text-2xl">{{ trust.name ? trust.name : "(Unnamed)" }}</p>
                    <p class="text-sm font-medium text-gray-600">
                        Beneficiary: <AddressField :address="trust.beneficiary"/> </p>
                    <p class="text-sm font-medium text-gray-600">
                        Trust Type: {{ trust.getTypeString() }}
                    </p>
                    <p class="text-sm font-medium text-gray-600">
                        Created by: <AddressField :address="trust.grantor"/> on {{ trust.getCreatedDate().toLocaleDateString() }}</p>
                    <p v-if="trust.trustees.length==1" class="text-sm font-medium text-gray-600"> 
                        Trustee: <AddressField :address="trust.trustees[0]"/>
                    </p>
                    <p v-else-if="trust.trustees.length > 1" class="text-sm font-medium text-gray-600">
                        {{ trust.trustees.length }} Trustees: 
                        <span v-for="trustee in trust.trustees"><AddressField :address="trustee"/>, </span>
                    </p>
                </div>
            </div>
            <div v-if="updatingText != ''" class="badge" :class="updatingClass">
                {{ updatingText }}
            </div>
            <div v-else class="flex hover:text-blue-500 text-base font-light justify-center items-center sm:mt-0">
                Edit <ChevronRightIcon class="h-6 w-6" aria-hidden="true" />
                <!-- <Button class="btn-white" :click="emit('onclick')">Edit</Button> -->
            </div>
        </div>
    </div>

    <div class="border-t rounded-b-md border-gray-200 items-center bg-gray-50 grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
        <div class="space-x-1 px-6 py-2 text-sm font-medium text-center">
            <span class="text-gray-600">Trust ID:</span>
            <AddressField :address="trust.key" class="text-gray-900"/>
        </div>
        <div class="space-x-1 px-6 py-2 text-sm font-medium text-center">
            <span class="text-gray-600">Amount:</span>
            <span class="text-gray-900">{{etherAmount}}</span>
        </div>
        
        <div v-if="!available" class="space-x-1 px-6 py-2 text-sm font-medium text-center">
            <span class="text-gray-600">Available After:</span>
            <span class="text-red-500">{{trust.getMaturityDate().toLocaleDateString()}}</span>
        </div>
        <div v-else-if="available" class="space-x-1 px-6 py-2 text-sm font-medium text-center">
            <span class="text-green-500">Available Now!</span>
        </div>
    </div>
</div>
</template>

<script setup="props, {emit}" lang="ts">

import { inject, computed } from 'vue';
import { ChevronRightIcon } from '@heroicons/vue/outline'

import TrustCert from './TrustCert.vue'
import AddressField from './AddressField.vue'

import { Trust } from '../services/Trust';
import TrustList from '../services/TrustList';
import CurrencyExchange from '../services/CurrencyExchange';
import * as utils from '../services/Utils';

const exchange = <CurrencyExchange> inject('exchange');

const emit = defineEmits(['onclick']);
const props = defineProps({
    trust: { type: Trust, required: true },
});

const list = <TrustList> inject("TrustList");
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
    { text: "Updating...", class: "badge-updating" },
    { text: "Deleting...", class: "badge-deleting" },
    { text: "Creating...", class: "badge-creating" },
];
const updatingText = computed(() => updatingInfo[list.trustState(props.trust.key)].text);
const updatingClass = computed(() => updatingInfo[list.trustState(props.trust.key)].class);

</script>

<style scoped>
    .card {
        @apply rounded-lg bg-white shadow
        cursor-pointer
        hover:border-gray-500
        hover:text-gray-400
        text-white
        border
        relative
    }
    .eth-amount {
        @apply -ml-2 text-black text-base flex items-center rounded-md whitespace-nowrap;
    }
    .cert-name {
        position: absolute;
        top: 38%;
        left: 50%;
        transform: translate(-50%, -50%);
        @apply text-base font-serif font-thin leading-tight uppercase;
    }
    .badge {
        @apply bg-white border rounded-full px-2 py-1 text-sm z-50;
    }
    .badge-updating {
        @apply  border-blue-500 text-blue-500;
    }
    .badge-deleting {
        @apply  border-red-500 text-red-500;
    }
    .badge-creating {
        @apply  border-green-500 text-green-500;
    }
    .cert-eth {
            position: absolute;
            top: 70%;
            left: 50%;
            transform: translate(-50%, -50%);
            @apply text-white font-bold;
    }
    .cert-nbr {
            position: absolute;
            top: 96%;
            left: 50%;
            transform: translate(-50%, -50%);
    }

    .card-tag-beneficiary {
        @apply flex-shrink-0 
            flex 
            items-center 
            bg-gradient-to-b
            from-black
            via-green-900
            to-green-900
            text-white 
            justify-center 
            w-20 
            h-full 
            rounded-l-2xl;
    }
    .card-icon {
        @apply inline text-gray-400 h-10 w-10;
    }
    .card-header {
        @apply text-lg mb-2 font-light text-black;
    }
    .card-body {
        @apply text-sm text-black sm:text-base flex-1 min-w-0 mt-2 mb-2;
    }
    .highlight-enter-from {
        @apply bg-blue-300 rounded-md;
        transition: all 5s;
    }
    .highlight-enter-to {
        @apply bg-white;
        transition: all 5s;
    }
    .pop-enter-from {
        @apply text-yellow-300;
        transform: scale(2) translate(-50%, -50%);
        transition: ease-out 0.8s;
    }
    .pop-enter-to {
        @apply text-white;
        transform: scale(1) translate(-50%, -50%);
        transition: ease-out 0.8s
    }
</style>