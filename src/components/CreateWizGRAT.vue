<!--
    Create Wizard Trustee List
--> 
<template>
<div class="absolute overflow-y-auto w-full">
    <div class="sm:px-4 mt-4 md:px-6 flex items-center sm:space-x-5 ">
        <h3 class="text-2xl sm:text-2xl font-medium leading-6 text-gray-900">
            <slot></slot>
        </h3>
    </div>
    <div class="text-base sm:ml-5 sm:px-4 sm:py-2">
        <div class="flex flex-col space-y-2">
            <div class="mt-2 mb-5">
                Configure your Grantor Retained Annuity Trust.
            </div>
            <div>
                <label for="years">
                    Number of years to pay you back?
                </label>
                <input type="number" id="years" name="years">
            </div>
            <div>
                <label for="payout_period">
                    Payout Period? 
                </label>
                <select id="payout_period">
                    <option value="Yearly">
                        Yearly                                                                                                                                                                               
                    </option>
                    <option value="Quarterly">
                        Quarterly
                    </option>
                    <option value="Monthly">
                        Monthly
                    </option>
                </select>
            </div>
        </div>
    </div>
</div>
</template>

<script setup="props, {emit}" lang="ts">
import { computed } from 'vue';

// components

// services
import Trust from '../services/Trust';

const props = defineProps({ modelValue: { type: Trust, required: true } });
const emit = defineEmits(['update:modelValue']);

const trust = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

</script>

<style scoped>
</style>
