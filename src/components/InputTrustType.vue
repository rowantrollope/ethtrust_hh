<!-- This example requires Tailwind CSS v2.0+ -->
<template>
<Listbox as="div" v-model="selected">
    <ListboxLabel class="sr-only">
        Select Trust Type
    </ListboxLabel>
    <div class="relative">
    <ListboxButton class="relative w-full max-w-lg py-2 pl-3 pr-10 text-left bg-white rounded-md border border-gray-300 cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 focus:ring-indigo-500 focus:border-indigo-500">
        <span class="block truncate text-black">{{ selected.title }}</span>
        <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <SelectorIcon class="w-5 h-5 text-gray-400" aria-hidden="true" />
        </span>
    </ListboxButton>

    <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
    <ListboxOptions class="origin-top-right z-10 text-left right-0 mt-2 w-full rounded-md shadow-lg overflow-hidden bg-white divide-y divide-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none">
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

// 3rd party Components
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, SelectorIcon } from '@heroicons/vue/solid'

// services
import Trust, { TrustType, TypeStrings } from '../services/Trust';

const props = defineProps({ modelValue: { type: Trust, required: true } });
const emit = defineEmits(['update:modelValue']);

const trust = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

const trustDescriptions = [

    { title: TypeStrings[TrustType.REVOCABLE], 
      description: 'Grantor continues to have access to the trust once created.', 
      type: TrustType.REVOCABLE, 
      current: false, 
      revocable: true },

    { title: TypeStrings[TrustType.IRREVOCABLE], 
      description: 'Once created, only trustee and beneficiary will have access.', 
      type: TrustType.IRREVOCABLE, 
      current: true, 
      revocable: false },

    { title: TypeStrings[TrustType.QTIP], 
      description: 'Qualified Terminal Interest Property. The beneficiary receives interest income but not principle.', 
      type: TrustType.QTIP, 
      current: false, 
      revocable: false },
    
    { title: TypeStrings[TrustType.GRAT], 
      description: 'Grantor Retained Annuity Trust. Grantor receives an annuity and remaining principle is transferred to beneficiaries.', 
      type: TrustType.GRAT, 
      current: false, 
      revocable: false },

    { title: TypeStrings[TrustType.SPECIAL_NEEDS], 
      description: 'An irrevocable trust established to benefit a child with special needs.', 
      type: TrustType.SPECIAL_NEEDS, 
      current: false, 
      revocable: false},

    { title: TypeStrings[TrustType.SPENDTHRIFT], 
      description: 'An irrevocable trust where trustees are required to distribute funds to beneficiaries.', 
      type: TrustType.SPENDTHRIFT, 
      current: false, 
      revocable: false },

];

onUpdated(() => trust.value.trustType = selected.value.type );

const change = watch(trust.value, (val, newVal) => selected.value = trustDescriptions[trust.value.trustType] );

const selected = ref(trustDescriptions[trust.value.trustType])

</script>

<style scoped>
</style> 
