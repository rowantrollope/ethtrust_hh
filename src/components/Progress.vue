<!--
    Create New Trust Wizard
--> 
<template>
<nav aria-label="Progress">
    <ol class="border bg-white border-gray-300 rounded-t flex divide-y-0">
    <li v-for="(panel, idx) in panels" class="relative flex-1 flex">
        <!-- COMPLETED ITEM, CURRENT ITEM, NEXT ITEM --> 
        
        <div v-if="idx === currentPanel" class="item" aria-current="step">
            <span class="border-black item-circle">                    
                <span v-if="idx===currentPanel" class="text-black text-sm">{{ idx+1 }}</span>
            </span>
            <span class="item-text mr-2 text-black">{{ panel }}</span>
        </div>
        <div v-if="idx < currentPanel" class="px-4 py-1 flex text-sm items-center w-full">
            <span class="opacity-50 flex items-center">
                <span class="border-green-600 item-circle -ml-2">
                    <CheckIcon class="text-green-500 w-5 h-5" aria-hidden="true" />
                </span>
                <span class="item-text -ml-2 text-green-600">{{ panel }}</span>
            </span>
        </div>
        <div v-else-if="idx > currentPanel" class="px-4 py-1 flex text-sm items-center">
            <span class="opacity-50 flex items-center">
                <span class="border-gray-300 item-circle">
                    <span class="text-gray-500">{{ idx+1 }}</span>
                </span>
                <span class="item-text -ml-2 text-gray-500">{{ panel }}</span>
            </span>
        </div>

        <template v-if="(idx !== panels.length - 1)">
            <!-- Arrow separator for lg screens and up -->
            <div class="block absolute top-0 right-0 h-full w-5" aria-hidden="true">
                <svg class="h-full w-full text-gray-300" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
                    <path d="M0 -2L20 40L0 82" vector-effect="non-scaling-stroke" stroke="currentcolor" stroke-linejoin="round" />
                </svg>
            </div>
        </template>
    </li>
    </ol>
</nav>
</template>

<script setup="props, {emit}" lang="ts">
// 3rd party Components
import { CheckIcon } from '@heroicons/vue/outline'

const props = defineProps({
    panels: { type: Array, required: true },
    currentPanel: { type: Number, required: true },
});

let panel: string;

</script>

<style scoped>
    .item {
        @apply px-2 py-2 flex items-center;
    }
    .item-circle {
        @apply hidden shrink-0 w-6 h-6 items-center justify-center border rounded-full;
    }
    .item-text {
        @apply xl:text-base whitespace-nowrap lg:text-xs text-xs ;
    }
    .pop-enter-active {
        @apply transition transform ease-in duration-700;
    }
    .pop-enter-from {
        @apply opacity-50 scale-125;
    }
    .pop-enter-to {
        @apply opacity-100 scale-100;
    }
    .fade-enter-active {
        @apply transition transform ease-in duration-700;
    }
    .fade-enter-from {
        @apply opacity-50;
    }
    .fade-enter-to {
        @apply opacity-100;
    }

</style>
