<!--
    Modal Dialog
--> 
<template>
<TransitionRoot as="template" :show="open">
    <Dialog as="div" static class="fixed z-50 inset-0 " @close="open = false" :open="open">
        <div class="flex h-full sm:items-end sm:align-top justify-center sm:min-h-screen sm:pt-4 sm:px-4 sm:pb-20 text-center sm:block ">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-filter backdrop-blur-sm" />
            </TransitionChild>

            <!-- This element is to trick the browser into centering the modal contents. -->
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                
            <!-- dialog window -->
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <div class="inline-block
                            align-bottom
                            sm:align-middle
                            bg-white
                            sm:rounded-lg
                            shadow-xl 
                            sm:overflow-hidden 
                            overflow-y-scroll
                            h-auto
                            sm:h-auto
                            sm:p-6
                            p-4 
                            sm:max-w-4xl 
                            w-full 
                            text-left 
                            transform 
                            transition-all 
                            sm:my-8">

                    <div class="h-full flex flex-col">
                    <!-- Dialog Title -->
                    <div class="text-xl mb-2 sm:mb-0 sm:text-2xl leading-6 text-gray-900">
                            <slot name="title"></slot>
                        </div>
                        <div class="sm:block absolute top-0 right-0 pt-4 pr-4">
                            <button type="button" @click="emit('cancel')" class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <span class="sr-only">Close</span>
                                <XIcon class="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                        <!-- MAIN DIALOG CONTENT -->
                        <div class="flex-grow sm:p-4 p-1">
                            <slot></slot>    
                        </div>
                        <div class="sm:px-4 px-1">
                            <slot name="buttons"></slot>

                        </div>
                    </div>
                </div>
            </TransitionChild>
        </div>
    </Dialog>
</TransitionRoot>
</template>

<script setup="props, {emit}" lang="ts">
// 3rd party components
import { Dialog, DialogOverlay, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XIcon } from '@heroicons/vue/solid';

const props = defineProps({
    open: Boolean,
});

const emit = defineEmits(['cancel']);

</script>

<style scoped>
    
</style>
