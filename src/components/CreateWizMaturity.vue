<!--
    Create Wizard Maturity Date
--> 
<template>
    <div class="absolute overflow-y-auto">
        <div class="px-4 mt-4 sm:px-6 flex items-center space-x-5 ">
            <h3 class="text-2xl font-medium leading-6 text-gray-900">
                <slot></slot>
            </h3>
        </div>
        <div class="text-lg px-4 py-2">
            <dl class="sm:divide-y sm:divide-gray-200">

                <div class="row">
                    <dt class="input-label">
                        Maturity Date
                    </dt>
                    <dd class="input-col flex">
                        <DatePicker v-model="maturityDate" :min-date="tomorrow" mode="date" class="flex-grow"/>
                    </dd>
                </div>
                <div class="input-description"> 
                    The "Maturity Date" is the date at which this trust will become available to the benficiary.
                    this date can be changed at a later time by you, OR by a trustee in the event of your death.
                </div>

                <div v-if="false" class="row">
                    <dt class="input-label">
                        Maturity Rules
                    </dt>
                    <dd class="input-col">
                    </dd>
                </div>
            </dl>
        </div>
    </div>
</template>

<script setup="props, {emit}" lang="ts">
import { computed, ref, onBeforeMount, onUpdated } from 'vue';
import { DatePicker } from 'v-calendar';

import { Trust } from '../services/Trust';

const props = defineProps({
    modelValue: { type: Trust, required: true },
});
const emit = defineEmits(['update:modelValue']);

const trust = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

const tomorrow = new Date();
const maturityDate = ref(new Date());

const mounted = onBeforeMount(() => {
    tomorrow.setDate(tomorrow.getDate() + 1);
    maturityDate.value = tomorrow;
});

const updated = onUpdated(() => trust.value.setMaturityDate(<Date>maturityDate.value));


</script>

<style scoped>
.input-field {
    @apply md:flex-1 text-lg -ml-3 block border-2 border-gray-200 rounded-lg w-full min-w-0 focus:ring-indigo-500 ;
}
.input-label {
    @apply font-medium text-gray-900 mt-2;
}
.input-description {
    @apply ml-10 mb-5 text-sm text-gray-400 border-none;
}
.input-col {
    @apply text-gray-400 sm:mt-0 sm:col-span-2;
}
.row {
    @apply sm:py-5 sm:grid sm:grid-cols-3 sm:gap-1 sm:px-6;
}

</style>
