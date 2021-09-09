<!--
    Create Wizard Trustee List
--> 
<template>
<div class="absolute overflow-y-auto w-full">
    <div class="sm:px-4 mt-4 md:px-6 flex items-center sm:space-x-5 ">
        <h3 class="text-2xl sm:text-2xl font-medium leading-6 text-gray-900">
            <slot></slot>
        </h3>
    </div>
    <div class="text-base sm:ml-5 sm:px-4 sm:py-2">
        <div class="flex flex-col space-y-2">
            <div class="mt-2 mb-5 text-sm ">
                Configure your Grantor Retained Annuity Trust (GRAT).  The GRAT will pay you back your initial investment over a period of years (2 minimum).  After the payback period, your beneficiary will receive the remainder including any appreciation.
            </div>
            <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="sm:col-span-1">
                    Ether amount to invest
                </dt>
                <dd class=" text-gray-900 sm:col-span-2">
                    <InputEther class="sm:-mt-5" v-model="etherAmount">
                    </InputEther>
                </dd>
                <dt class="sm:col-span-1">
                    Number of years to pay you back?
                </dt>
                <dd class=" text-gray-900 sm:col-span-2">
                    <input v-model="payoutYears" type="number" id="years" name="years" class="rounded-md border border-gray-300">
                </dd>
                <dt class="sm:col-span-1">
                    Pay me every
                </dt>
                <dd class=" text-gray-900 sm:col-span-2">
                    <select id="payout_period" value="Year" v-model="payoutPeriod" class="rounded-md border border-gray-300">
                        <option value="Year"> Year  </option>
                        <option value="Quarter"> Quarter </option>
                        <option value="Month">  Month </option>
                    </select>
                </dd>
            </div>
            <div class="text-base text-center">
                This trust will pay you back {{ payPerPeriod }} per {{ payoutPeriod }} for {{ payoutYears }} years.
            </div>
        </div>
    </div>
</div>
</template>

<script setup="props, {emit}" lang="ts">
import { ref, computed, onUpdated } from 'vue';
import { ethers } from 'ethers';

// components
import InputEther from './InputEther.vue';

// services
import Trust from '../services/Trust';

const props = defineProps({ modelValue: { type: Trust, required: true } });
const emit = defineEmits(['update:modelValue']);
const etherAmount = ref(0);
const payoutPerPeriod = ref(0);
const payoutPeriod = ref("");
const payoutYears = ref(2);

const trust = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

onUpdated(() => {
    console.log("Ether Amount", etherAmount.value);
    if(etherAmount.value > 0)
        trust.value.etherAmount = ethers.utils.parseEther(etherAmount.value.toString())
});
const payPerPeriod = computed(() => {
    let divisor = 1;

    if(payoutPeriod.value == "Quarter")
        divisor = 4;
    else if(payoutPeriod.value == "Month")
        divisor = 12;
    
    return etherAmount.value / divisor;
})
</script>

<style scoped>
</style>
