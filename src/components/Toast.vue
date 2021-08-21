<!--
        Toast dialog to display temoporary notifications.    

        TODO: Make this component handle its own timer/close function
-->
<template>             
    <!-- Global notification live region, render this permanently at the end of the document -->
    <div class="z-50 fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start" aria-live="assertive" >
        <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
            <!-- Notification panel, dynamically insert this into the live region when it needs to be displayed -->
            <transition name="slideup">
                <div v-if="open" class="max-w-sm w-full bg-white shadow-lg border rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <div class="p-4">
                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <CheckCircleIcon class="h-8 w-8 text-green-400" aria-hidden="true" />
                            </div>
                            <div class="ml-3 w-0 flex-1 pt-0.5">
                                <p class="text-xl font-medium text-gray-900">
                                    <slot name="title"></slot> 
                                </p>
                                <p class="mt-1 text-lg text-gray-500">
                                    <slot name="message"></slot>
                                </p>
                            </div>
                            <div class="ml-4 flex-shrink-0 flex">
                                <button @click="open = false" class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    <span class="sr-only">Close</span>
                                    <XIcon class="h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup="props, {emit}">
import { defineProps } from 'vue'
import { XIcon, CheckCircleIcon } from '@heroicons/vue/outline';
import { TransitionRoot, TransitionChild } from '@headlessui/vue';

const props = defineProps({
    open: Boolean,
});

</script>

<style scoped>
    .slideup-enter-active {
        @apply transition transform ease-out duration-500;
    }
    .slideup-enter-from {
        @apply translate-y-4 opacity-0;
    }
    .slideup-enter-to {
        @apply translate-y-0 opacity-100;
    }
    .slideup-leave-active {
        @apply transition transform ease-in duration-300;
    }
    .slideup-leave-from {
        @apply opacity-100;
    }
    .slideup-leave-to {
        @apply opacity-0;
    }

</style>
