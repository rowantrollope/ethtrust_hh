<template>
<div>
    <dl class="grid grid-cols-13 gap-5 sm:grid-cols-3">
        <div class="px-4 py-3 bg-white border shadow rounded-lg overflow-hidden sm:p-3">
            <dt class="text-sm font-medium text-gray-500 truncate">
                Total Trusts
            </dt>
            <dd class="mt-1 text-xl font-semibold text-gray-900">
                {{ trusts.length }}
            </dd>
        </div>
        <div class="px-4 py-3 bg-white border shadow rounded-lg overflow-hidden sm:p-3">
            <dt class="text-sm font-medium text-gray-500 truncate">
                Total Value
            </dt>
            <dd class="mt-1 text-xl flex sm:block font-semibold text-green-500">
                {{ totalValue }} ETH
                <div class="text-lg ml-2 sm:ml-0 text-gray-500">( {{ totalValueUSD }} )</div>
            </dd>
        </div>
        <div class="hidden sm:block px-4 py-3 bg-white border shadow rounded-lg overflow-hidden sm:p-3">
            <dt class="text-sm font-medium text-gray-500 truncate">
                Next Available
            </dt>
            <dd class="mt-1 text-xl font-semibold text-gray-900">
                {{ nextAvailable.toLocaleDateString() }}
            </dd>
        </div>
    </dl>
</div>
</template>
  
<script setup="props" lang="ts">
import { computed, inject } from 'vue'
import { ethers } from 'ethers';

import CurrencyExchange from '../services/CurrencyExchange';
import { Trust } from "../services/Trust"

const exchange = <CurrencyExchange> inject("exchange");

const totalValueUSD = computed(() => exchange ? exchange.eth2usdFormatted(Number(totalValue.value)) : "" );

const props = defineProps({
    trusts: { type: Array, required: true },
});

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