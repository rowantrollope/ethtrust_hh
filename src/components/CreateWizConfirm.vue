<!--
    Create Wizard Confirmation
--> 
<template>
<div class="absolute overflow-y-auto">
    <div class="mt-4 sm:px-4 flex items-center space-x-5 ">
        <h3 class="text-2xl font-medium leading-6 text-gray-900">
            <slot></slot>
        </h3>
    </div>
    <div class="text-sm px-6 py-6 grid gap-3 grid-cols-10">
        <!-- <TrustCardEx :trust="trust"></TrustCardEx> -->
        <div class="item-label">Name:</div> 
            <div class="item-text">{{ trust.name }}</div>

        <div class="item-label">Beneficiary:</div>
            <div class="item-text"><AddressField :address="trust.beneficiary"/></div>

        <div class="item-label">Trust Type:</div>
            <div class="item-text">{{ trust.getTypeString() }}</div>

        <div class="item-label">Maturity:</div>
            <div class="item-text">{{ trust.getMaturityDate().toLocaleDateString() }}</div>
        
        <template v-if="trust.trustees.length" >
            <div class="item-label">Trustees: </div>
            <div class="item-text">
                <span v-for="trustee in trust.trustees" :key="trustee"><AddressField :address="trustee"/>,</span>
            </div>
        </template>

        <div class="item-label">Amount:</div>
            <div class="item-text">{{ utils.toEther(trust.etherAmount) }}</div>
        </div>

        <div class="text-red-500 leading-tight sm:ml-12 text-sm sm:text-base">
            Reminder: Once you create this fund and transfer your money, 
            you will no longer have access until the trust fund maturity date
            releases the funds to your beneficiary.
        </div>
</div>
</template>

<script setup="props, {emit}" lang="ts">
import { computed } from 'vue';

// components
import AddressField from './AddressField.vue';

// services
import Trust from '../services/Trust';
import { utils } from '../services/Utils';

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
