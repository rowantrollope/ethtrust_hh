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
        <div class="text-lg sm:pl-4">
            <dl class="sm:divide-y sm:divide-gray-200">
                <div class="row">
                    <dt class="input-label">
                        Trust name
                    </dt>
                    <dd class="input-col">
                        <input type="text" 
                            placeholder="(Optional) Enter name of the trust"
                            v-model="trust.name" 
                            name="trust_name" 
                            id="trust_name" 
                            autocomplete="trust_name" 
                            class="input-field" />
                    </dd>

                </div>
                <div class="input-description"> 
                    Note: The name of the trust will be publicly visible on the blockchain. 
                </div>
                <div class="row">
                    <dt class="input-label">
                        Trust Type
                    </dt>
                    <dd class="input-col flex items-center">
                        <InputTrustType class="text-base" v-model="trust"></InputTrustType> 
                        <a class="text-blue-500 underline ml-5" href="#/About">Learn More</a>
                    </dd>
                </div>
            </dl>
        </div>
    </div>
</template>

<script setup="props, {emit}" lang="ts">

import { computed, ref } from 'vue';

import { RadioGroup, RadioGroupDescription, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'

import InputBeneficiary from './InputBeneficiary.vue';
import InputTrustType from './InputTrustType.vue';

import { Trust } from '../services/Trust';

const selected = ref('');
const props = defineProps({
    modelValue: { type: Trust, required: true },
});
const emit = defineEmits(['update:modelValue']);

const validEntry = ref(true);

const trust = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});
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
