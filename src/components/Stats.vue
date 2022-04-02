<template>
<div>
    <button class="hidden btn btn-success" @click="showStats = !showStats"/>
    <TopAlert :show="show" class="block -mt-5 mb-2 -mx-5 sm:hidden">
        {{ trusts.length }} Trusts, Total Value {{ totalValue }} ETH ({{totalValueUSD}})
    </TopAlert>

    <div class="mb-5 space-x-4 flex hidden sm:block">
        <div class="grow-[2] px-4 py-3 bg-stone-50 dark:bg-slate-900 border dark:border-stone-600 shadow rounded-lg overflow-hidden sm:p-3">
            <div class="text-sm font-medium text-gray-500 dark:text-stone-200 truncate">
                <span class="block sm:hidden">
                    Trusts
                </span>
                <span class="hidden sm:block">
                    Total Trusts
                </span>
            </div>
            <div class="mt-1 text-xl font-semibold">
                {{ trusts.length }}
            </div>
        </div>
        <div class="grow-[2] px-4 py-3 bg-stone-50 dark:bg-slate-900 border dark:border-stone-600 shadow rounded-lg overflow-hidden sm:p-3">
            <div class="text-sm font-medium text-gray-500 dark:text-stone-200 truncate">
                Total Value
            </div>
            <div class="mt-1 text-xl flex font-semibold text-green-500">
                <span class="text-blueGray-300 bg-transparent ">
                    <svg class="-ml-2" xmlns="http://www.w3.org/2000/svg" height="28" width="28" preserveAspectRatio="xMidYMid" viewBox="-38.39985 -104.22675 332.7987 625.3605"><path fill="#343434" d="M125.166 285.168l2.795 2.79 127.962-75.638L127.961 0l-2.795 9.5z"/><path fill="#8C8C8C" d="M127.962 287.959V0L0 212.32z"/><path fill="#3C3C3B" d="M126.386 412.306l1.575 4.6L256 236.587l-128.038 75.6-1.575 1.92z"/><path fill="#8C8C8C" d="M0 236.585l127.962 180.32v-104.72z"/><path fill="#141414" d="M127.961 154.159v133.799l127.96-75.637z"/><path fill="#393939" d="M127.96 154.159L0 212.32l127.96 75.637z"/></svg>
                </span>
                <span class="-ml-1 shrink-0">
                    {{ totalValue }} ETH
                </span>
                <span class="text-lg ml-2 sm:ml-2 text-gray-500 dark:text-stone-200 truncate">({{totalValueUSD}})</span>
            </div>
        </div>
        <div class="grow-[1] hidden sm:block px-4 py-3 bg-stone-50 dark:bg-slate-900 border dark:border-stone-600 shadow rounded-lg overflow-hidden sm:p-3">
            <div class="text-sm font-medium text-gray-500 dark:text-stone-200 truncate">
                Next Available
            </div>
            <div class="mt-1 text-xl font-semibold text-gray-900 dark:text-stone-200 ">
                {{ nextAvailable.toLocaleDateString() }}
            </div>
        </div>
    </div>
</div>
</template>
  
<script setup="props" lang="ts">
import { computed, ref } from 'vue'
import { ethers } from 'ethers';

// services
import { useCurrencyExchange } from '../services/CurrencyExchange';
import Trust from "../services/Trust"

// components
import TopAlert from './TopAlert.vue';

const showStats = ref(false);

const show = computed(() => {
    if(showStats.value === false)
        setTimeout(() => { showStats.value = true; }, 2000);
    
    return showStats.value;
});

const props = defineProps({
    trusts: { type: Array, required: true },
});

const exchange = useCurrencyExchange();

const totalValueUSD = computed(() => exchange ? exchange.eth2usdFormatted(Number(totalValue.value)) : "" );

const totalValue = computed(() => {
    let amount: number = 0;
    for (const trust of props.trusts) {
        amount += Number(ethers.utils.formatEther((trust as Trust).etherAmount));
    }
    let n = parseFloat(amount.toString()).toFixed(2);
    return ethers.utils.commify(n.toString());
});

const nextAvailable = computed(() => {
    
    let next = 0;
    
    for (const trust of props.trusts) { 
        if((trust as Trust).maturityDate.toNumber() > next)
            next = (trust as Trust).maturityDate.toNumber();
    }
    return new Date(next * 1000);
});
</script>