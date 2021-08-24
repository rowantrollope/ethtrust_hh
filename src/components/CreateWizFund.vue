<!--
    Create Wizard - Fund the trust
--> 
<template>
    <div class="absolute overflow-y-auto">
        <div class="sm:px-4 py-5 flex items-center space-x-5">
            <h3 class="text-2xl font-medium leading-6 text-gray-900">
                <slot></slot>
            </h3>
        </div>
        <div class=" border-gray-200 text-lg px-4 py-5">
            <dl class="sm:divide-y sm:divide-gray-200">
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="input-label">
                        Ether amount
                    </dt>
                    <dd class=" text-gray-900 sm:col-span-2">
                        <InputEther class="sm:-mt-5" v-model="etherAmount">
                        </InputEther>
                    </dd>
                </div>
                <div class="input-description"> 
                    (Required)
                    Enter the amount of ETH you would like to place into this trust fund.
                    When you create the fund, you will be prompted by your wallet to approve the tranfer of funds.
                    As the creator of the trust, you will no longer have access to these funds.
                    You can add more ETH to this fund at any time in the future.
                </div>
            </dl>
        </div>
    </div>
</template>

<script setup="props, {emit}" lang="ts">
import { onUpdated, computed, inject, ref } from 'vue';
import { ethers } from 'ethers';

import InputEther from './InputEther.vue';

import { BlockchainConnect } from '../services/BlockchainConnect';
import { Trust } from '../services/Trust';

const etherAmount = ref(0);
const bc = <BlockchainConnect> inject("BlockchainConnect");

const props = defineProps({
    modelValue: { type: Trust, required: true },
});
const emit = defineEmits(['update:modelValue']);

const trust = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

const updated = onUpdated(() => {
    console.log("Ether Amount", etherAmount.value);
    if(etherAmount.value > 0)
        trust.value.etherAmount = ethers.utils.parseEther(etherAmount.value.toString())
})

</script>

<style scoped>
.input-field {
    @apply md:flex-1 text-lg -mt-2 -ml-3 block border-none w-full min-w-0 focus:ring-indigo-500 ;
}
.input-label {
    @apply font-medium sm:text-right sm:-mt-2 text-gray-900;
}
.input-description {
    @apply sm:ml-10 mb-5 text-xs sm:text-base text-gray-400 border-none;
}
</style>
