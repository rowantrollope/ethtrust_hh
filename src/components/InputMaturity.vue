<template>
<div class="grid grid-cols-12 gap-6">
    <div class="col-span-4 justify-self-end pt-2 ">
        <label for="trust_name" class="label-text">Trust name</label>
    </div>

    <div class="col-span-8">
        <input type="text" v-model="trust.name" name="trust_name" id="trust_name" autocomplete="trust-name" class="input-field" />
    </div>
    <div class="col-span-4 justify-self-end pt-2 ">
        <label for="maturity_date" class="label-text">Maturity Date</label>
    </div>
    <div class="col-span-8">     
        <DatePicker v-model="maturityDate" mode="date" class="flex-grow">
            <template v-slot="{ inputValue, inputEvents }">
                <input class="input-field"
                    :value="inputValue"
                    v-on="inputEvents"
                />
            </template>
        </DatePicker>
    </div>
</div>
</template>

<script setup="props, {emit}" lang="ts">
import { computed } from 'vue'
import { BigNumber} from "@ethersproject/bignumber";

// components
import { DatePicker } from 'v-calendar';

// services
import Trust from '../services/Trust'

const props = defineProps({ modelValue: { type: Trust, required: true } });

const emit = defineEmits(['update:modelValue', 'valid', 'invalid']);

const trust = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

const maturityDate = computed({
    get: () => new Date(trust.value.maturityDate.toNumber() * 1000),
    set: (value) => trust.value.maturityDate = BigNumber.from(value.getTime() / 1000),
});

</script>

<style scoped>
.input-field {
    @apply  text-base text-black p-2 block border focus:ring-indigo-500 focus:border-indigo-500 w-full min-w-0 rounded-md border-gray-300;
}
.input-field-invalid {
    @apply  text-base text-red-500 p-2 block border focus:ring-red-500 focus:border-red-500 w-full min-w-0 rounded-md border-red-500;
}
</style> 
