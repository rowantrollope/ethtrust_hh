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

        <div class="p-5">
            <div class="text-gray-500 text-sm"> 
                Assign a Beneficiary for this trust. The "Beneficiary" is the person who will get access to this trust fund after the maturity date and requires an Ethereum Wallet to be setup in order to receive the funds after the maturity date.
            </div>
            <div class="mb-5 mt-5">
                Do you have an Ethereum Account setup for your beneficiary?
            </div>
            <RadioGroup v-model="selected">
            <RadioGroupLabel class="sr-only">Server size</RadioGroupLabel>
            <div class="space-y-2 md:px-20">
                <RadioGroupOption as="template" v-for="option in options" :key="option.ID" :value="option" v-slot="{ active, checked }" >
                <div :class="[active ? 'ring-2 ring-offset-2 ring-offset-blue-500 ring-blue-300 ring-opacity-60' : '',
                                checked ? 'bg-white text-black border-blue-500 border-2' : 'bg-white border']"
                                class="relative flex px-5 py-4 rounded-lg border-gray-300 cursor-pointer focus:outline-none">
                    <div class="flex items-center justify-between w-full">
                        <div class="flex items-center">
                            <div class="text-sm">
                                <RadioGroupLabel as="p" :class="checked ? 'text-black' : 'text-gray-900'" class="font-medium">
                                    {{option.name}}
                                </RadioGroupLabel>
                            </div>
                        </div>
                    <div v-show="checked" class="flex-shrink-0 text-green-500">
                        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="12" fill="green" fill-opacity="0.5" />
                        <path d="M7 13l3 3 7-7" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                    </div>
                </div>
                </RadioGroupOption>
            </div>
            </RadioGroup>

            <div v-if="selected.ID === 0" class="mt-10 ml-5">
                <dt class="input-label">
                    Beneficiary
                </dt>
                <dd class="input-col">
                    <InputBeneficiary v-model="trust"
                        @valid="validEntry = true" 
                        @invalid="validEntry = false"></InputBeneficiary>
                </dd>
            </div>
            <div v-if="selected.ID === 1" class="mt-10 text-center">
                <span class="text-blue-500 cursor-pointer underline" @click="$router.push('./About')">Click here to learn more about creating an account</span>
            </div>


        </div>

</div>
</template>

<script setup="props, {emit}" lang="ts">
import { computed, ref } from 'vue';

// 3rd party Components
import { RadioGroup, RadioGroupDescription, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'

// components
import InputBeneficiary from './InputBeneficiary.vue';

// services
import Trust from '../services/Trust';

const props = defineProps({
    modelValue: { type: Trust, required: true },
});

const emit = defineEmits(['update:modelValue']);

const validEntry = ref(true);

const trust = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

const options = [
{
    ID: 0,
    name: 'Yes, I have an account setup already',
    description: 'An account on the Ethereum Blockchain',
},
{
    ID: 1,
    name: 'No I havent created an account yet',
    description: 'We will help guide you through the process',
},
]

const selected = ref(options[0])
  
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
