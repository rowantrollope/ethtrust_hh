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
    <!-- PROGRESS INDICATOR  
    <Progress class="hidden sm:block" :panels="panels" :panelIndex="panelIndex"></Progress>
    -->

    <!-- DIALOGS --> 
    <div class="slider">
        <transition :name="panelClass">
            <CreateWizWelcome class="window" v-model="trust" v-show="isPanelActive('Welcome')">
                Getting Started
            </CreateWizWelcome> 
        </transition>
        <transition :name="panelClass">
            <CreateWizName class="window" v-model="trust" v-show="isPanelActive('Trust Type')">
                Select trust type
            </CreateWizName> 
        </transition>
        <transition :name="panelClass">
            <CreateWizBeneficiaryNew class="window" v-model="trust" v-show="isPanelActive('Beneficiary')" @validEntry="onValidEntry">
                Who is this for?
            </CreateWizBeneficiaryNew> 
        </transition>
        <transition :name="panelClass">
            <CreateWizGRAT class="window" v-model="trust" v-show="isPanelActive('Payments')">
                Setup Grantor Retained Annuity Trust 
            </CreateWizGRAT> 
        </transition>
        <transition :name="panelClass">
            <CreateWizMaturity class="window" v-model="trust" v-show="isPanelActive('Maturity Date')">
                When should they get it?
            </CreateWizMaturity> 
        </transition>
        <transition :name="panelClass">
            <CreateWizTrustees class="window" v-model="trust" v-show="isPanelActive('Trustees')">
                Add Trustees
            </CreateWizTrustees> 
        </transition>
        <transition :name="panelClass">
            <CreateWizFund class="window"  v-model="trust" v-show="isPanelActive('Funding')" @validEntry="onValidEntry">
                How much should they get?
            </CreateWizFund> 
        </transition>
        <transition :name="panelClass">
            <CreateWizConfirm class="window"  v-model="trust" v-show="isPanelActive('Confirmation')">
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
            <button v-if="!isFirstPanel()" class="flex-1 btn btn-primary-outline" :onClick="prev">
                Back
            </button>
            <button v-if="isLastPanel()" class="flex-1 btn btn-success" :onClick="onCreate">
                Create Now 
            </button>
            <button v-else-if="!isLastPanel()" class="flex-1" 
                    :class="[enableNextButton ? 'btn btn-primary' : 'btn btn-disabled']" :onClick="next">
                Next
            </button>
        </div>
    </template>
</Modal>
</template>

<script setup="props, {emit}" lang="ts">
import { ref, computed, inject, watch, onUpdated } from 'vue';

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
import { useBlockchainConnect, ConnectionState } from '../services/BlockchainConnect';
import Trust, { TrustType } from '../services/Trust';
import TrustList from '../services/TrustList';

const panels_normal = ref(["Welcome", "Trust Type", "Beneficiary", "Maturity Date", "Trustees", "Funding", "Confirmation"]);
const panels_GRAT = ref(["Welcome", "Trust Type", "Payments", "Beneficiary", "Trustees", "Confirmation"]);

const panels = ref([
    { 
        name: "Welcome", 
        init: (): void => {}, 
        validEntry: true,
    },
    { 
        name: "Trust Type", 
        init: (): void => {},
        validEntry: true, 
    },
    { 
        name: "Beneficiary", 
        init: (): void => {},
        validEntry: false, 
    },
    { 
        name: "Maturity Date", 
        init: (): void => {},
        validEntry: true, 
    },
    { 
        name: "Trustees", 
        init: (): void => {},
        validEntry: true, 
    },
    { 
        name: "Funding", 
        init: (): void => {},
        validEntry: false, 
    },
    { 
        name: "Confirmation", 
        init: (): void => {},
        validEntry: true, 
    }, 
]);

const panelIndex = ref(0);
const activePanel = () => panels.value[panelIndex.value];
const nextPanel = (): number => panelIndex.value < panels.value.length ? panelIndex.value++ : panelIndex.value; 
const prevPanel = (): number => panelIndex.value > 0 ? panelIndex.value-- : panelIndex.value;
const isPanelActive = (panel: string): boolean => panels.value[panelIndex.value].name === panel;
const isFirstPanel = (): boolean => panelIndex.value === 0;
const isLastPanel = (): boolean => panelIndex.value === panels.value.length -1;
const setNextPanel = (_panel: string) => {
    let idx = panels.value.findIndex((panel) => panel.name === _panel) 
    if(idx != -1) {
        panelIndex.value = idx;
    } else
        console.log("Can't find: ", _panel);
}

const trust = ref<Trust>(new Trust());

const bc = useBlockchainConnect();
const list = <TrustList> inject("TrustList");

const open = ref(false);
const emit = defineEmits(['close']);

const panelClass = ref('slide-left');
onUpdated(() => init() );

const enableNextButton = ref(true);

const onValidEntry = (isValid: boolean) => {
    activePanel().validEntry = isValid;
    enableNextButton.value = isValid;
} 

const init = () => {
    trust.value = new Trust(); 
    panelIndex.value = 0;

    if(bc.connectionState.value === ConnectionState.Connected)
        trust.value.grantor = bc.account.value; 
    else 
        console.error("Blockchain not loaded");
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

const next = () => {

    if(!enableNextButton.value) return;

    panelClass.value = "slide-left";

    nextPanel();

    enableNextButton.value = activePanel().validEntry;
}

const prev = () => {
    
    panelClass.value = "slide-right";

    prevPanel();

    enableNextButton.value = activePanel().validEntry;

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
