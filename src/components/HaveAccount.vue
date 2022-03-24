<template>
<div class="w-full max-w-md mx-auto px-4 py-16">
    <div class="mb-5">
        Do you have an Ethereum Account setup for your beneficiary?
    </div>
    <RadioGroup v-model="selected">
    <RadioGroupLabel class="sr-only">Server size</RadioGroupLabel>
    <div class="space-y-2">
        <RadioGroupOption as="template" v-for="option in options" :key="option.ID" :value="option" v-slot="{ active, checked }" >
        <div :class="[active ? 'ring-2 ring-offset-2 ring-offset-blue-500 ing-blue-300 ring-opacity-60' : '',
                        checked ? 'bg-white bg-opacity-75 text-black text-white border-blue-500 border' : 'bg-white']"
                        class="relative flex px-5 py-4 rounded-lg shadow-md cursor-pointer focus:outline-none">
            <div class="flex items-center justify-between w-full">
                <div class="flex items-center">
                    <div class="text-sm">
                    <RadioGroupLabel as="p" :class="checked ? 'text-black' : 'text-gray-900'" class="font-medium">
                        {{option.name}}
                    </RadioGroupLabel>

                    </div>
                </div>
            <div v-show="checked" class="shrink-0 text-green-500">
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="#000" fill-opacity="0.2" />
                <path d="M7 13l3 3 7-7" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
            </div>
        </div>
        </RadioGroupOption>
    </div>
    </RadioGroup>

    <div v-if="selected.ID === 0" class="mt-10 ml-5">
        Account# 
        <input class="w-full" type="text" placeholder="Enter Account Number (starts with 0x0)"/>
    </div>
    <div v-if="selected.ID === 1" class="mt-10 ml-5">
        <span class="text-blue-500 underline">Click here to learn more about creating an account</span>
    </div>
</div>
</template>
  
<script setup="props,emits" lang="ts">
import { ref } from 'vue'

// 3rd party Components
import { RadioGroup, RadioGroupLabel, RadioGroupDescription, RadioGroupOption } from '@headlessui/vue'

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
  