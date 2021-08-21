<template>
<div>
    <dl class="grid grid-cols-1 gap-5 sm:grid-cols-3">
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
            <dd class="mt-1 text-xl font-semibold text-green-500">
                {{ totalValue }} ETH
                <div class="text-lg text-gray-500">( {{ totalValueUSD }} )</div>
            </dd>
        </div>
        <div class="px-4 py-3 bg-white border shadow rounded-lg overflow-hidden sm:p-3">
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
import TrusteesVue from '../views/Trustees.vue';

const stats = [
{ name: 'Total Trusts', stat: "00" },
{ name: 'Total Value', stat: '58.16%' },
{ name: 'Time to maturity', stat: '24.57%' },
]

//const props = defineProps({
//    trusts: { type: Trust },
//});
const exchange = <CurrencyExchange> inject("exchange");

const totalValueUSD = computed(() => exchange ? exchange.eth2usdFormatted(totalValue.value) : "" );

const props = defineProps({
    trusts: { type: Array, required: true },
});

const totalValue = computed(() => {
    let amount = 0;
    for (const trust of props.trusts) {
        amount += Number(ethers.utils.formatUnits(trust.etherAmount));
    }
    return amount;
});

const nextAvailable = computed(() => {
    
    let next = 0;
    
    for (const trust of props.trusts) { 
        if(trust.maturityDate > next)
            next = trust.maturityDate;
    }
    return new Date(next * 1000);
});
</script>