<!--
    Create Wizard - Beneficiary
--> 
<template>
    <div class="absolute overflow-y-auto">
        <div class="sm:px-4 py-4 flex items-center space-x-5 ">
            <h3 class="text-2xl font-medium leading-6 text-gray-900">
                <slot></slot>
            </h3>
        </div>
        <article class="sm:ml-4 prose prose-lg">
            <p>To begin you'll need an Ethereum account for your beneficiary and optionally for one or more trustees.</p>
            <p>Accounts are long numbers that begin with "0x" - You can create these using a popular wallet app like MetaMask.</p>
            <p>This wizard will guide you through the process.</p>
            <p>The ethereum will be completely protected and only accessible to your beneficiary and trustee.</p>
            <p>Let's Go!!!</p>
        </article>
    </div>
</template>

<script setup="props, {emit}" lang="ts">

import { computed } from 'vue';

import { Trust } from '../services/Trust';

const props = defineProps({
    modelValue: { type: Trust, required: true },
});
const emit = defineEmits(['update:modelValue']);

</script>

<style scoped>
.input-field {
    @apply md:flex-1 text-base block border border-gray-300 rounded-md w-full min-w-0 focus:ring-indigo-500 text-black;
}
.input-label {
    @apply font-medium text-gray-900 mt-2;
}
.input-description {
    @apply ml-10 mb-5 text-sm text-gray-400 border-none;
}
.input-col {
    @apply text-gray-400 sm:mt-0 sm:col-span-4;
}
.row {
    @apply sm:py-4 sm:grid sm:grid-cols-5 sm:pl-6;
}
</style>
