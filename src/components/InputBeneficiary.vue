            trust.value.beneficiary = beneficiary;
<template>
    <span v-if="beneficiaryError" class="ml-20 text-red-500" >{{ beneficiaryError }}</span>
    <div class="flex mb-5">
        <div class="flex items-center mr-2"> Account: </div>
        <input type="input"
        @input="validate($event.target.value)"
        v-model="beneficiary"
        name="beneficiary" id="beneficiary" autocomplete="beneficiary"
        :class="[beneficiaryError ? 'input-field-invalid' : 'input-field']" />
    </div>
</template>

<script setup="props, {emit}" lang="ts">
import { ref, computed, onMounted } from 'vue'

import { Trust } from '../services/Trust';

const props = defineProps({
    modelValue: { type: Trust, required: true },
});

const emit = defineEmits(['update:modelValue', 'valid', 'invalid']);

const beneficiaryError = ref('');
const beneficiary = ref('');
const mounted = onMounted(() => {
    beneficiary.value = props.modelValue.beneficiary; 
})

const trust = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

const validate = (beneficiary: string) => {

    let result = trust.value.isValidBeneficiary(beneficiary);

    console.log(beneficiary);

    beneficiaryError.value = '';

    if(result.valid) {
        trust.value.beneficiary = beneficiary;
        emit('valid');
    } else {
        beneficiaryError.value = result.reason;
        emit('invalid');
    }
}

</script>

<style scoped>
.input-field {
    @apply  text-base text-black p-2 block border focus:ring-indigo-500 focus:border-indigo-500 w-full min-w-0 rounded-md border-gray-300;
}
.input-field-invalid {
    @apply  text-base text-red-500 p-2 block border focus:ring-red-500 focus:border-red-500 w-full min-w-0 rounded-md border-red-500;
}
</style> 
