<!--
    Create Wizard Trustee List
--> 
<template>
    <div class="absolute overflow-y-auto w-full">
        <div class="px-4 mt-4 sm:px-6 flex items-center space-x-5 ">
            <h3 class="text-2xl font-medium leading-6 text-gray-900">
                <slot></slot>
            </h3>
        </div>
        <div class="text-base ml-5 px-4 py-2">
            <p class="mb-5 mt-2">Each trustee will have full access to transfer or manage the funds in this trust.</p>
            <InputTrustees v-model="trust"></InputTrustees>
        </div>
    </div>
</template>

<script setup="props, {emit}" lang="ts">
import { computed } from 'vue';

import InputTrustees from './InputTrustees.vue';

import { Trust } from '../services/Trust';

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
</style>
