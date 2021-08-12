<!-- This example requires Tailwind CSS v2.0+ -->
<template>
    <Listbox as="div" v-model="selected">
        <ListboxLabel class="sr-only">
        Select Trust Type
        </ListboxLabel>
        <div class="relative">
        <ListboxButton class="relative w-40 py-2 pl-3 pr-10 text-left bg-white rounded-lg border border-gray-300 cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
            <span class="block truncate">{{ selected.title }}</span>
            <span
            class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
            >
            <SelectorIcon class="w-5 h-5 text-gray-400" aria-hidden="true" />
            </span>
        </ListboxButton>
      <!--
        <div class="relative">
            <div class="inline-flex shadow-sm rounded-md divide-x divide-indigo-600">
                <div class="relative z-0 inline-flex shadow-sm rounded-md divide-x divide-gray-300">
                    <div class="relative inline-flex items-center bg-white py-2 pl-3 pr-4 border border-transparent rounded-l-md shadow-sm text-black">
                        <CheckIcon class="h-5 w-5" aria-hidden="true" />
                        <p class="ml-2.5 text-sm font-medium">{{ selected.title }}</p>
                    </div>
                    <ListboxButton class="relative inline-flex items-center bg-white p-2 rounded-l-none rounded-r-md text-sm font-medium text-black hover:bg-gray-300 focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500">
                        <span class="sr-only">Change Trust Type</span>
                        <ChevronDownIcon class="h-5 w-5 text-black" aria-hidden="true" />
                    </ListboxButton>
                </div>
            </div>
    -->

        <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
          <ListboxOptions class="origin-top-right absolute z-10 text-left right-0 mt-2 w-72 rounded-md shadow-lg overflow-hidden bg-white divide-y divide-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <ListboxOption as="template" v-for="trustInfo in trustDescriptions" :key="trustInfo.title" :value="trustInfo" v-slot="{ active, selected }">
              <li :class="[active ? 'text-white bg-indigo-500' : 'text-gray-900', 'cursor-default select-none relative p-4 text-sm']">
                <div class="flex flex-col">
                  <div class="flex justify-between">
                    <p :class="selected ? 'font-semibold' : 'font-normal'">
                      {{ trustInfo.title }}
                    </p>
                    <span v-if="selected" :class="active ? 'text-white' : 'text-indigo-500'">
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>
                  <p :class="[active ? 'text-indigo-200' : 'text-gray-500', 'mt-2']">
                    {{ trustInfo.description }}
                  </p>
                </div>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </template>
  
<script setup="props, {emit}" lang="ts">
import { ref, computed, watch, onUpdated } from 'vue'
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, SelectorIcon } from '@heroicons/vue/solid'

import { Trust, TrustType, TypeStrings } from '../services/Trust';

const trustDescriptions = [

    { title: TypeStrings[TrustType.REVOKABLE], 
      description: 'Grantor continues to have access to the trust once created.', 
      type: TrustType.REVOKABLE, 
      current: false, 
      revokable: true },

    { title: TypeStrings[TrustType.IRREVOKABLE], 
      description: 'Once created, only trustee and beneficiary will have access.', 
      type: TrustType.IRREVOKABLE, 
      current: true, 
      revokable: false },

    { title: TypeStrings[TrustType.QTIP], 
      description: 'Qualified Terminal Interest Property. The beneficiary receives interest income but not principle.', 
      type: TrustType.QTIP, 
      current: false, 
      revokable: false },
    
    { title: TypeStrings[TrustType.GRAT], 
      description: 'Grantor Retained Annuity Trust. Grantor receives an annuity and remaining principle is transferred to beneficiaries.', 
      type: TrustType.GRAT, 
      current: false, 
      revokable: false },

    { title: TypeStrings[TrustType.SPECIAL_NEEDS], 
      description: 'An irrevokable trust established to benefit a child with special needs.', 
      type: TrustType.SPECIAL_NEEDS, 
      current: false, 
      revokable: false},

    { title: TypeStrings[TrustType.SPENDTHRIFT], 
      description: 'An irrevokable trust where trustees are required to distribute funds to beneficiaries.', 
      type: TrustType.SPENDTHRIFT, 
      current: false, 
      revokable: false },

];

const props = defineProps({
    modelValue: { type: Trust, required: true },
});

const trust = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});
const updated = onUpdated(() => {
    console.log("onUpdated()");
});
const change = watch(trust.value, (val, newVal) => {
    console.log("change");
    selected.value = trustDescriptions[trust.value.trustType];
});

const emit = defineEmits(['update:modelValue']);

const selected = ref(trustDescriptions[trust.value.trustType])

</script>

<style scoped>
</style> 
