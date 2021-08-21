<!--
    Individual "Card" display of a single TRUST 
--> 
<template>
    <div class="card"
        :class="[list.creating(trust.key) ? 'animate-pulse border-green-500 border-4' : 'border-gray-300',
                list.updating(trust.key) ? 'animate-pulse border-blue-500 border-4' : 'border-gray-300',
                list.deleting(trust.key) ? 'animate-pulse border-red-500 border-4' : 'border-gray-300`']" 
        >
        <div class="relative text-center text-black">
            <img alt="cert" width="250" height="200" src="../assets/money.png">
            <transition name="highlight" mode="out-in">
                <div class="cert-name" :key="trust.name">
                    {{ trust.name }}
                </div>            
            </transition>
            <transition name="pop" mode="out-in">
                <div class="cert-eth" :key="trust.etherAmount">
                    {{ formatEtherString(trust.etherAmount) }}
                </div>    
            </transition>
        </div>

        <div class="card-body">
            <div>
                <span class="eth-amount"> 
                    <svg xmlns="http://www.w3.org/2000/svg" height="32" width="32" preserveAspectRatio="xMidYMid" viewBox="-38.39985 -104.22675 332.7987 625.3605"><path fill="#343434" d="M125.166 285.168l2.795 2.79 127.962-75.638L127.961 0l-2.795 9.5z"/><path fill="#8C8C8C" d="M127.962 287.959V0L0 212.32z"/><path fill="#3C3C3B" d="M126.386 412.306l1.575 4.6L256 236.587l-128.038 75.6-1.575 1.92z"/><path fill="#8C8C8C" d="M0 236.585l127.962 180.32v-104.72z"/><path fill="#141414" d="M127.961 154.159v133.799l127.96-75.637z"/><path fill="#393939" d="M127.96 154.159L0 212.32l127.96 75.637z"/></svg>
                    <transition name="highlight" mode="out-in">
                        <span :key="trust.etherAmount">{{ formatEtherString(trust.etherAmount) }} ETH </span>
                    </transition>
                    <span class="text-base text-gray-400">
                        &nbsp;({{ usd }})
                    </span>
                </span>
                <div class="flex mt-5 space-x-2 text-sm">
                    <div class="text-right flex-shrink whitespace-nowrap">
                        <p>Trust Type: </p>                        
                        <p>Available on: </p>
                        <p>Beneficiary: </p>
                        <p>Trustees: </p>
                        <p>Created by: </p>
                        <p>Trust Key: </p>
                    </div>
                        <div class="flex-grow whitespace-nowrap">
                        <transition-group name="highlight" mode="out-in">                
                            <p :key="trust.trustType">{{ trust.getTypeString() }}</p>                            
                            <p :key="trust.maturityDate.toNumber()">{{ trust.getMaturityDate().toLocaleDateString() }}</p>
                            <p :key="trust.beneficiary">{{ shortenAddress(trust.beneficiary) }}</p>
                            <p v-if="trust.trustees.length > 1"> 
                                {{ trust.trustees.length }} Trustees </p>
                            <p v-else>
                                {{ shortenAddress(trust.trustees[0]) }}
                            </p>
                            <p :key="trust.grantor">{{ shortenAddress(trust.grantor) }}</p>
                            <p :key="trust.key">{{ shortenAddress(trust.key) }}</p>
                        </transition-group>
                        </div>
                </div>
            </div>
        </div>
        <div v-if="updatingText != ''"
            class="badge" :class="updatingClass">
            {{ updatingText }}
        </div>
        <ChevronRightIcon class="h-8 w-8" aria-hidden="true" />
    </div>
</template>

<script setup="props, {emit}" lang="ts">
import { inject, computed } from 'vue'
import { ChevronRightIcon } from '@heroicons/vue/outline'
import { shortenAddress, formatEtherString } from '../services/Helpers';

import { Trust } from '../services/Trust';
import TrustList from '../services/TrustList';

import CurrencyExchange from '../services/CurrencyExchange';

const exchange = <CurrencyExchange> inject('exchange');
const list = <TrustList> inject('TrustList');

const props = defineProps({
    trust: { type: Trust, required: true },
});

const emit = defineEmits(['onclick']);
const updatingInfo = [
    { text: "", class: "" },
    { text: "Updating...", class: "badge-updating" },
    { text: "Deleting...", class: "badge-deleting" },
    { text: "Creating...", class: "badge-creating" },
];
const usd = computed(() => exchange.wei2usd(props.trust.etherAmount));
const updatingText = computed(() => updatingInfo[list.trustState(props.trust.key)].text);
const updatingClass = computed(() => updatingInfo[list.trustState(props.trust.key)].class);
</script>

<style scoped>
    .card {
        @apply relative 
        border
        py-0 
        flex 
        space-x-3 
        items-center 
        rounded-r-2xl
        shadow-sm 
        bg-white 
        cursor-pointer
        hover:border-black
        text-white
        hover:text-gray-400;
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
        position: absolute;
        top: 0%;
        left: 50%;
        transform: translate(-50%, -50%);
        @apply bg-white border rounded-full px-2 py-1 text-sm;
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
