<!--
    Create New Trust Wizard
--> 
<template>
    <Modal :open="open" @cancel="onClose">
        <template v-slot:title>
            <!-- HEADER --> 
            <div class="flex items-center space-x-2 sm:space-x-5 ">
                <img class="" alt="cert" width="60" src="../assets/money.png">
                <h3 class="flex-1 text-base sm:text-3xl font-light sm:leading-6 text-gray-900">
                    Create new trust
                </h3>
            </div>
        </template>
        <!-- PROGRESS INDICATOR --> 
        <Progress class="hidden sm:block" :panels="panels" :currentPanel="currentPanel"></Progress>

        <!-- DIALOGS --> 
        <div class="slider">
            <transition :name="panelClass">
                <CreateWizBeneficiary class="window" v-model="trust" v-show="currentPanel === 0">
                    Who is this for?
                </CreateWizBeneficiary> 
            </transition>
            <transition :name="panelClass">
                <CreateWizMaturity class="window" v-model="trust" v-show="currentPanel === 1">
                    When should they get it?
                </CreateWizMaturity> 
            </transition>
            <transition :name="panelClass">
                <CreateWizTrustees class="window" v-model="trust" v-show="currentPanel === 2">
                    Add Trustees
                </CreateWizTrustees> 
            </transition>
            <transition :name="panelClass">
                <CreateWizFund class="window"  v-model="trust" v-show="currentPanel === 3">
                    How much should they get?
                </CreateWizFund> 
            </transition>
            <transition :name="panelClass">
                <CreateWizConfirm class="window"  v-model="trust" v-show="currentPanel === 4">
                    Confirm the details
                </CreateWizConfirm> 
            </transition>
        </div>

        <!-- FOOTER --> 
        <div class="mt-1 flex bg-white space-x-5">
            <Button class="flex-1 btn btn-danger-outline" :onClick="onClose">
                Cancel
            </Button>
            <Button v-if="!isFirstPanel" class="flex-1 btn btn-primary-outline" :onClick="prev">
                Back
            </Button>
            <Button v-if="isLastPanel" class="flex-1 btn btn-success" :onClick="onCreate">
                Create Now 
            </Button>
            <Button v-else-if="!isLastPanel" class="flex-1 btn btn-primary" :onClick="next">
                Next >
            </Button>
        </div>
    </Modal>
</template>

<script setup="props, {emit}" lang="ts">

import { ref, computed, inject, onUpdated } from 'vue';

import Modal from './Modal.vue';
import Button from './Button.vue';
import CreateWizBeneficiary from './CreateWizBeneficiary.vue';
import CreateWizMaturity from './CreateWizMaturity.vue';
import CreateWizTrustees from './CreateWizTrustees.vue';

import CreateWizFund from './CreateWizFund.vue';
import CreateWizConfirm from './CreateWizConfirm.vue';
import Progress from './Progress.vue';

import BlockchainConnect from '../services/BlockchainConnect';
import { Trust } from '../services/Trust';
import TrustList from '../services/TrustList';

const panels = ref(["Beneficiary", "Maturity Date", "Trustees", "Funding", "Confirmation"]);

const trust = ref<Trust>(new Trust());

const bc = <BlockchainConnect> inject("BlockchainConnect");
const list = <TrustList> inject("TrustList");

const open = ref(false);
const emit = defineEmits(['close']);

const currentPanel = ref(0);
const isFirstPanel = computed(() => currentPanel.value === 0 );
const isLastPanel = computed(() => currentPanel.value === panelCount.value-1 )
const panelCount = computed(() => panels.value.length );
const panelClass = ref('slide-left');

const onClose = () => { open.value = false; init(); emit('close'); }

const onCreate = async () => { 
    
    console.log("Creating Trust: ", trust.value);

    // Since trustee is not required, set to beneficiary if its left empty
    await list.createTrust(trust.value);

    // Close this dialog
    open.value = false;
    emit('close');
    // RESET to start
    //init();
}

const updated = onUpdated(() => {
    init();
});

const init = () => {
    trust.value = new Trust(); 
    currentPanel.value = 0;
    if(bc.loaded.value) {
        trust.value.grantor = bc.account.value; 
        console.log("CreateWiz::init() - ", bc.account.value, trust.value.grantor);
    } else console.error("Blockchain not loaded");
}

const next = () => {
    panelClass.value = "slide-left";
    if(currentPanel.value < panelCount.value)
        currentPanel.value++;
}

const prev = () => {
    panelClass.value = "slide-right";
    if(currentPanel.value > 0)
        currentPanel.value--;
}

</script>

<style scoped>
    .slider {
      position: relative;
      z-index: 1;
      overflow: scroll;
      height: 57vh;
    }

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
    .slide-left-enter-active {
        @apply transition transform ease-out duration-300;
    }
    .slide-left-enter-from {
        @apply translate-x-full opacity-50;
    }
    .slide-left-enter-to {
        @apply translate-x-0 opacity-100;
    }
    .slide-left-leave-active {
        @apply transition transform ease-in duration-300;
    }
    .slide-left-leave-from {
        @apply translate-x-0 opacity-100;
    }
    .slide-left-leave-to {
        @apply -translate-x-full opacity-50;
    }

    .slide-right-enter-active {
        @apply transition transform ease-out duration-300;
    }
    .slide-right-enter-from {
        @apply -translate-x-full opacity-50;
    }
    .slide-right-enter-to {
        @apply translate-x-0 opacity-100;
    }
    .slide-right-leave-active {
        @apply transition transform ease-in duration-300;
    }
    .slide-right-leave-from {
        @apply translate-x-0 opacity-100;
    }
    .slide-right-leave-to {
        @apply translate-x-full opacity-50;
    }

</style>