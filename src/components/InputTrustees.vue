<template>
<div>
    <span class="text-red-500">{{ errorText }}</span>
    <div class="flex mb-5">
        <input type="flex-grow text-sm" 
                v-model="newTrustee" 
                name="trustee" 
                id="trustee" 
                autocomplete="trustee" 
                placeholder="Enter a valid address"
                :class="[!errorText ? 'input-field' : 'input-field-invalid']" />
        <Button class="flex-shrink-0 ml-4" 
                :class="[!errorText ? 'btn-success' : 'btn-disabled']" 
                :disabled="errorText ? true : false"
                @click="addTrustee()">Add Trustee</Button>
    </div>
    <ul class="border rounded-md border-gray-200 min-w-full divide-y divide-gray-200">
        <div class="bg-gray-100">
            <div class="p-2">Trustee Accounts</div>
        </div>
        <div class="overflow-y-auto p-1 bg-white divide-y divide-gray-200">
            <li v-for="trustee in trust.trustees" :key="trustee" class="mx-3 py-2 flex">
                <div class="flex-grow text-sm font-medium text-gray-900">{{ trustee }}</div>
                <button @click="deleteTrustee(trustee)"><XIcon class="mr-2 text-gray-700 hover:text-red-500 flex-shrink h-4 w-4" aria-hidden="true"  /></button>                
            </li>
        </div>
    </ul>
</div>
</template>

<script setup="props, {emit}" lang="ts">
import { ref, computed, watch } from 'vue'
import { XIcon } from '@heroicons/vue/solid';

import { Trust } from '../services/Trust'

import Button from './Button.vue';

const props = defineProps({
    modelValue: { type: Trust, required: true },
});

const newTrustee = ref('');

const emit = defineEmits(['update:modelValue', 'valid', 'invalid']);
const errorText = ref('');
const isValid = ref(false);

const isError = watch(newTrustee, (val, newVal) => {
    
    if(newTrustee.value == '') {
        errorText.value='';
        isValid.value = false;
        return;
    }
    
    let result = trust.value.isValidTrustee(newTrustee.value)
     
    if(result.valid)    
        errorText.value='';
    else
        errorText.value=result.reason;
});

const trust = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
});

const deleteTrustee = (address: string) => {
    trust.value.removeTrustee(address);
}

const addTrustee = () => {
    console.log("AddTrustee", newTrustee.value);
    try {
        trust.value.addTrustee(newTrustee.value)
        newTrustee.value = '';
    } catch(e) {
        errorText.value = "Error adding trustee: " + e;
        return;
    }
}

</script>

<style scoped>
.input-field {
    @apply  text-base text-black p-2 block border focus:ring-indigo-500 focus:border-indigo-500 w-full min-w-0 rounded-md border-gray-300;
}
.input-field-invalid {
    @apply text-base text-red-500 p-2 block border focus:ring-red-500 focus:border-red-500 w-full min-w-0 rounded-md border-red-500;
}
</style> 
