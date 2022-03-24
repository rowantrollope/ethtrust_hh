            trust.value.beneficiary = beneficiary;
<template>
<div>
    <span v-if="beneficiaryError" class="text-red-500 text-sm" >{{ beneficiaryError }}</span>
    <div class="flex">
        <div class="flex items-center"><slot></slot></div>
        <input type="input"
        @input="validate($event.target)"
        v-model="beneficiary"
        placeholder="Enter Beneficiary Account #"
        name="beneficiary" id="beneficiary" autocomplete="beneficiary"
        :class="[beneficiaryError ? 'text-base text-red-500 p-2 block border focus:ring-red-500 focus:border-red-500 w-full min-w-0 rounded-md border-red-500' 
                                    : 'text-base text-black p-2 block border focus:ring-indigo-500 focus:border-indigo-500 w-full min-w-0 rounded-md border-gray-300']" />
    </div>
</div>
</template>

<script setup="props, {emit}" lang="ts">
import { ref, computed, onMounted } from 'vue'

// services
import Trust, { TrustType } from '../services/Trust';

const props = defineProps({ modelValue: { type: Trust, required: true } });

const emit = defineEmits(['update:modelValue', 'valid', 'invalid']);

const trust = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

const beneficiaryError = ref('');
const beneficiary = ref('');

onMounted(() => beneficiary.value = props.modelValue.beneficiary );

const revocable = computed(() => trust.value.trustType === TrustType.REVOCABLE);

const validate = (e: EventTarget | null) => {
    if(e === null) return;
    
    let newBeneficiary = (e as HTMLInputElement).value;

    let result = trust.value.isValidBeneficiary(newBeneficiary);

    console.log(newBeneficiary);

    beneficiaryError.value = '';

    if(result.valid) {
        trust.value.beneficiary = newBeneficiary;
        emit('valid');
    } else {
        beneficiaryError.value = result.reason;
        emit('invalid');
    }
}

</script>
