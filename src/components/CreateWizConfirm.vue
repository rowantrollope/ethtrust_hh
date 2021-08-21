<!--
    Create Wizard Confirmation
--> 
<template>
    <div class="absolute overflow-y-auto">
        <div class="mt-4 px-4 sm:px-6 flex items-center space-x-5 ">
            <h3 class="text-2xl font-medium leading-6 text-gray-900">
                <slot></slot>
            </h3>
        </div>
        <div class="text-sm px-6 py-6 grid gap-3 grid-cols-10">
            <!-- <TrustCardEx :trust="trust"></TrustCardEx> -->
            <div class="item-label">Creating trust named:</div> 
                <div class="item-text">{{ trust.name }}</div>

            <div class="item-label">Beneficiary:</div>
                <div class="item-text">{{ trust.beneficiary }}</div>

            <div class="item-label">Trust Type:</div>
                <div class="item-text">{{ trust.getTypeString() }}</div>

            <div class="item-label">Maturity Date:</div>
                <div class="item-text">{{ trust.getMaturityDate().toLocaleDateString() }}</div>

            <div class="item-label">Trustees: </div>
                <div class="col-span-7 col-start-4" v-for="trustee in trust.trustees">{{trustee}},<br/></div>
    
            <div class="item-label">ETH Amount:</div>
                <div class="item-text">{{ toEther(trust.etherAmount) }}</div>
        </div>
        <div class="text-red-500 leading-tight ml-12 text-sm">
            Reminder: Once you create this fund and transfer your money, 
            you will no longer have access until the trust fund maturity date
            releases the funds to your beneficiary.
        </div>
    </div>
</template>

<script setup="props, {emit}" lang="ts">
import { computed } from 'vue';

import TrustCardEx from './TrustCardEx.vue';

import { Trust } from '../services/Trust';
import { toEther, toDate } from '../services/Helpers';

const props = defineProps({
    modelValue: { type: Trust, required: true },
});
const emit = defineEmits(['update:modelValue']);

const trust = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});
</script>

<style scoped>
.item-label {
    @apply col-span-3 text-right text-gray-700;
}
.item-text {
    @apply col-span-7;
}
</style>
