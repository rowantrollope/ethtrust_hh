<!--
    
    The Ceate Trust dialog.  This dialog is invoked to create a trust.  The dialog itself sets up the values
    but doesn't do the creation.  That is handled by the caller.

-->
<template>
    <TransitionRoot as="template" :show="open">
        <Dialog as="div" static class="fixed z-50 inset-0 overflow-y-auto" @close="open = false" :open="open">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                    <DialogOverlay class="screen-overlay" />
                </TransitionChild>

                <!-- This element is to trick the browser into centering the modal contents. -->
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                    
                    <div class="dialog-window">
                        <div class="dialog-title">
                            <slot name="title"></slot>
                        </div>
                        <div class="block absolute top-0 right-0 pt-4 pr-4">
                            <button type="button" class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" @click="onCancel">
                                <span class="sr-only">Close</span>
                                <XIcon class="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                        <div class="mt-5">
                            <form action="#" method="POST">
                                <div class="rounded-md px-4 py-5 bg-white sm:p-6">
                                    <div class="grid grid-cols-12 gap-6">
                                        <div class="fieldblock ">
                                            <label for="trust_name" class="label-text">Name</label>
                                            <input type="text" 
                                                v-model="trust.name" 
                                                placeholder="(Optional) Enter a name for this trust"
                                                name="trust_name" 
                                                id="trust_name" 
                                                autocomplete="trust-name" 
                                                class="input-field" />
                                        </div>

                                        <div class="fieldblock">
                                            <label for="beneficiary_account" class="label-text">Beneficiary</label>
                                            <input type="text" 
                                                    placeholder="(Required) Enter account number for beneficiary"
                                                    v-model="trust.beneficiary" 
                                                    name="beneficiary_account" 
                                                    id="beneficiary_account" 
                                                    autocomplete="beneficiary_account" 
                                                    class="input-field" />
                                        </div>
                                        <div class="fieldblock">
                                            <label for="trustee_account" class="label-text">Trustee</label>
                                            <input type="text" 
                                                    placeholder="(Optional) Enter account number for trustee"
                                                    v-model="trust.trustee" 
                                                    name="trustee_account" 
                                                    id="trustee_account" 
                                                    autocomplete="trustee_account" 
                                                    class="input-field" />
                                        </div>
                                        <div class="fieldblock">
                                            <label for="maturity_date" class="label-text">Maturity Date</label>
                                            <DatePicker v-model="maturityDate" mode="date" class="flex-grow">
                                                <template v-slot="{ inputValue, inputEvents }">
                                                    <input class="input-field"
                                                        :value="inputValue"
                                                        v-on="inputEvents"
                                                    />
                                                </template>
                                            </DatePicker>

                                        </div>

                                        <div class="fieldblock text-lg">
                                            <EthInput :balance="bc.etherBalance" v-model="trust.etherAmount">
                                                Deposit Amount:
                                            </EthInput>
                                        </div>

                                    </div>
                                </div>
                            </form>
                        </div> 
                        <div class="dialog-footer">
                            <Button class="flex-1 btn-white mx-2" :onClick="onCancel" >
                                Cancel
                            </Button>
                            <Button class="flex-1 btn-success mx-2" :onClick="onCreate">
                                Create New Trust
                            </Button>                                                    

                        </div>                               
                    </div>
                </TransitionChild>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup="props, {emit}">
import { ref, watch, computed, onUpdated, defineProps, defineEmit } from 'vue'
import { Dialog, DialogOverlay, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XIcon, ExclamationIcon } from '@heroicons/vue/outline'
import { Calendar, DatePicker } from 'v-calendar';

import Button from '@/components/Button.vue';
import EthInput from '@/components/EthInput.vue';
import { toEther, toDate } from '@/services/Helpers'
import bc from '@/services/Blockchain';

const props = defineProps({
    trust: Object,
    create: Boolean,
});

const emit = defineEmit(['create', 'cancel']);

const maturityDate = ref(Date);

// Variables
const open = ref(true)
const inputValue = ref(Date)

const ethAmount = computed(() => toEther(trust.etherAmount));

// Methods
const onCreate = () => { 
    props.trust.maturityDate = new Date(maturityDate.value) / 1000; 
    console.log("DATE ONUPDATED", maturityDate.value, props.trust.maturityDate);
    open.value = false; 
    emit('create'); 
};

const onCancel = () => { open.value = false; emit('cancel'); };

const updated = onUpdated(() => { 
    console.log("onUpdated ", maturityDate.value, props.trust.maturityDate)
    maturityDate.value = toDate(props.trust.maturityDate); 
});

</script>

<style scoped>

.screen-overlay {
    @apply fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity;
}    
.dialog-window {
    @apply inline-block align-bottom bg-white rounded-2xl px-4 pt-5 pb-4 sm:max-w-3xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full sm:p-6;
}
.dialog-icon {
    @apply mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10;
}
.dialog-title {
    @apply text-2xl leading-6 text-gray-900;
}
.dialog-footer {
    @apply flex mt-4 px-4 py-3 text-right sm:px-6;
}
.input-field {
    @apply md:flex-1 text-lg p-2 block border focus:ring-indigo-500 focus:border-indigo-500 w-full min-w-0 rounded-md border-gray-300;
}
.label-text {
    @apply flex md:inline-flex block text-left text-lg font-medium text-gray-700;
}

.fieldblock {
    @apply sm:flex items-center space-x-3 col-span-12;
}
</style> 
