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
            <CreateWizWelcome class="window" v-model="trust" v-show="currentPanel === wizPanels.Welcome">
                Getting Started
            </CreateWizWelcome> 
        </transition>
        <transition :name="panelClass">
            <CreateWizName class="window" v-model="trust" v-show="currentPanel === wizPanels.Type">
                Define the trust type
            </CreateWizName> 
        </transition>
        <transition :name="panelClass">
            <CreateWizBeneficiaryNew class="window" v-model="trust" v-show="currentPanel === wizPanels.Beneficiary">
                Who is this for?
            </CreateWizBeneficiaryNew> 
        </transition>
        <transition :name="panelClass">
            <CreateWizGRAT class="window" v-model="trust" v-show="currentPanel === wizPanels.GRAT">
                Configure Trust
            </CreateWizGRAT> 
        </transition>
        <transition :name="panelClass">
            <CreateWizMaturity class="window" v-model="trust" v-show="currentPanel === wizPanels.Maturity">
                When should they get it?
            </CreateWizMaturity> 
        </transition>
        <transition :name="panelClass">
            <CreateWizTrustees class="window" v-model="trust" v-show="currentPanel === wizPanels.Trustees">
                Add Trustees
            </CreateWizTrustees> 
        </transition>
        <transition :name="panelClass">
            <CreateWizFund class="window"  v-model="trust" v-show="currentPanel === wizPanels.Fund">
                How much should they get?
            </CreateWizFund> 
        </transition>
        <transition :name="panelClass">
            <CreateWizConfirm class="window"  v-model="trust" v-show="currentPanel === wizPanels.Confirm">
                Confirm the details
            </CreateWizConfirm> 
        </transition>
    </div>
    
    <!-- FOOTER --> 
    <template v-slot:buttons>
        <div class="mt-1 flex bg-white space-x-5">
            <button class="flex-1 btn btn-danger-outline" :onClick="onClose">
                Cancel
            </button>
            <button v-if="!isFirstPanel" class="flex-1 btn btn-primary-outline" :onClick="prev">
                Back
            </button>
            <button v-if="isLastPanel" class="flex-1 btn btn-success" :onClick="onCreate">
                Create Now 
            </button>
            <button v-else-if="!isLastPanel" class="flex-1 btn btn-primary" :onClick="next">
                Next >
            </button>
        </div>
    </template>
</Modal>
</template>

<script setup="props, {emit}" lang="ts">
import { ref, computed, inject, onUpdated } from 'vue';

// components
import Modal from './Modal.vue';
import CreateWizWelcome from './CreateWizWelcome.vue';
import CreateWizName from './CreateWizType.vue';
import CreateWizBeneficiaryNew from './CreateWizBeneficiaryNew.vue';
import CreateWizGRAT from './CreateWizGRAT.vue';
import CreateWizMaturity from './CreateWizMaturity.vue';
import CreateWizTrustees from './CreateWizTrustees.vue';
import CreateWizFund from './CreateWizFund.vue';
import CreateWizConfirm from './CreateWizConfirm.vue';
import Progress from './Progress.vue';

// services
import { BlockchainConnect, ConnectionState } from '../services/BlockchainConnect';
import Trust, { TrustType } from '../services/Trust';
import TrustList from '../services/TrustList';

const panels = ref(["Welcome", "Trust Type", "Beneficiary", "Maturity Date", "Trustees", "Funding", "Confirmation"]);

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

onUpdated(() => init() );

const init = () => {
    trust.value = new Trust(); 
    currentPanel.value = 0;
    if(bc.connectionState.value === ConnectionState.Connected) {
        trust.value.grantor = bc.account.value; 
        console.log("CreateWiz::init() - ", bc.account.value, trust.value.grantor);
    } else console.error("Blockchain not loaded");
}

const onClose = () => { open.value = false; init(); emit('close'); }

const onCreate = async () => { 
    
    console.log("Creating Trust: ", trust.value);

    // Since trustee is not required, set to beneficiary if its left empty
    await list.createTrust(trust.value);

    // Close this dialog
    open.value = false;
    emit('close');
}

enum wizPanels {
    Welcome = 0,
    Type,
    GRAT,
    Beneficiary,
    Maturity,
    Trustees,
    Fund,
    Confirm,
    PanelCount,
}

const next = () => {
    panelClass.value = "slide-left";

    if(currentPanel.value === wizPanels.Type) {
        if(trust.value.trustType === TrustType.GRAT)
            currentPanel.value = wizPanels.GRAT;
        else
            currentPanel.value = wizPanels.Beneficiary;
        
    } else if(currentPanel.value < panelCount.value)
        currentPanel.value++;
}

const prev = () => {
    panelClass.value = "slide-right";
    if(currentPanel.value === wizPanels.Beneficiary) {
        if(trust.value.trustType === TrustType.GRAT)
            currentPanel.value = wizPanels.GRAT;
        else
            currentPanel.value = wizPanels.Type;
        
    } else if(currentPanel.value > 0)
        currentPanel.value--;
}

</script>

<style scoped>
    .slider {
      position: relative;
      z-index: 1;
      overflow: scroll;
      height: 68vh;
    }    
    .input-field {
        @apply md:flex-1 text-lg p-2 block border focus:ring-indigo-500 focus:border-indigo-500 w-full min-w-0 rounded-md border-gray-300;
    }
    .label-text {
        @apply flex md:inline-flex text-left text-lg font-medium text-gray-700;
    }
    .window {
        @apply w-full
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
