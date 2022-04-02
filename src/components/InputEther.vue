<!--
    Input field which displays an ETH logo, and shows a USD (or other) conversion in real-time
--> 
<template>
<div class="flex items-center justify-center space-x-1">                    
    <div class="text-right shrink-0 sm:text-right">
        <slot></slot>
    </div>
    <div class="p-1 shrink text-left sm:text-center sm:space-x-2">
        <span class="absolute text-blueGray-300 bg-transparent pl-3 py-3">
            <svg class="-mt-2" xmlns="http://www.w3.org/2000/svg" height="32" width="32" preserveAspectRatio="xMidYMid" viewBox="-38.39985 -104.22675 332.7987 625.3605"><path fill="#343434" d="M125.166 285.168l2.795 2.79 127.962-75.638L127.961 0l-2.795 9.5z"/><path fill="#8C8C8C" d="M127.962 287.959V0L0 212.32z"/><path fill="#3C3C3B" d="M126.386 412.306l1.575 4.6L256 236.587l-128.038 75.6-1.575 1.92z"/><path fill="#8C8C8C" d="M0 236.585l127.962 180.32v-104.72z"/><path fill="#141414" d="M127.961 154.159v133.799l127.96-75.637z"/><path fill="#393939" d="M127.96 154.159L0 212.32l127.96 75.637z"/></svg>
        </span>
        <input class="text-base w-28 px-3 py-2 pl-10 rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 placeholder-gray-300"
                type="number" 
                placeholder="ETH"
                v-model="eth" 
        />
        <span class="ml-2 shrink-0 text-gray-400">
        {{ eth2usd }}
    </span>
    </div>
</div>
</template>

<script setup="props, {emit}" lang="ts">
import { computed } from 'vue';

// services
import { useCurrencyExchange } from '../services/CurrencyExchange';

const props = defineProps({ modelValue: { type: Number, required: true } });
const emit = defineEmits(['update:modelValue']);

const exchange = useCurrencyExchange();

const eth2usd = computed(() => exchange ? exchange.eth2usdFormatted(props.modelValue ? props.modelValue : 0) : "" );

const eth = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

</script>

<style scoped>
</style>