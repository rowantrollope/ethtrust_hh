<!--
    Handles the "Connected" button to display the state of the connection to the blockchain / metamask
    
    Currently handles three states: Connect, Connected and Error.
    
    TODO: Add animation for transitions.    
-->
<template>
    <Popover class="relative">
        <PopoverButton v-if="bc.loaded" class="h-7 popover-button" @click="onClicked()">
            <!-- <Jazzicon class="-ml-1 mt-1" :address="bc.account.value" :diameter="24"/> -->
            <StatusOnlineIcon class="status-icon" aria-hidden="true" />
            <span class="ml-1">Connected</span>
            <!-- <ChevronDownIcon class="text-black -ml-1 h-6 w-6" aria-hidden="true" /> -->
        </PopoverButton>
        <PopoverButton v-else-if="bc.connectionError" class="popover-button-warning" @click="onClicked()">
            <StatusOnlineIcon class="status-icon-warning" aria-hidden="true" />
            <span class="status-text">Not Connected </span>
        </PopoverButton>
        <PopoverButton v-else-if="!bc.loaded" class="popover-button-connect" v-on:click.prevent="onClicked()">
            <StatusOnlineIcon class="status-icon-connect" aria-hidden="true" />
            <span class="status-text-connect">Start</span>
        </PopoverButton>

        <transition name="fadeslide">
            <PopoverPanel v-if="bc.loaded" class="popover-panel">
                <div class="flex-col text-left vertical space-y-3">
                    <div class="flex items-center space-y-3 text-lg ">
                        <StatusOnlineIcon class="h-6 w-6 text-green-500"/> &nbsp;Blockchain Connected
                    </div>
                    <div class="flex">
                        Account: <span class=""> &nbsp;<AddressField :address="bc.account.value"/></span>
                    </div>
                    <div class="flex">
                        Balance: <span class=""> &nbsp;{{ toEtherStringRounded(bc.balance) }} ETH </span>
                    </div>
                </div>
            </PopoverPanel>
            <PopoverPanel v-else-if="bc.connectionError" class="popover-panel">
                <div class="flex-col vertical space-y-5">
                    <p class="flex text-xl border text-red-500 border-red-500 p-2 rounded-md ">
                        Failed to connect to the Blockchain
                    </p>
                    <p>
                        Error Message: {{ bc.connectionError }}
                    </p>
                    <p class="flex">
                        Account: &nbsp; <b> {{ bc.account.value }} } </b>
                    </p>
                    <div class="text-right">
                    <Button class="btn-primary" @click="onClicked()">Try Again</Button>
                    </div>
                </div>
            </PopoverPanel>
        </transition>
    </Popover>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import { StatusOnlineIcon, ShieldCheckIcon } from '@heroicons/vue/outline';

import Button from './Button.vue';
import AddressField from './AddressField.vue';

import CurrencyExchange from '../services/CurrencyExchange';
import BlockchainConnect from '../services/BlockchainConnect';
import { toEtherStringRounded } from '../services/Helpers';

const bc: BlockchainConnect = <BlockchainConnect> inject('BlockchainConnect');
const exchange = <CurrencyExchange> inject('exchange');

const onClicked = () => {

}

const eth2usd = computed(() => exchange ? exchange.eth2usdFormatted(bc.balance.toNumber()) : "" );

</script>

<style scoped>
    .popover-button {
        @apply text-white px-1 font-thin items-center flex text-xs rounded-full hover:bg-gray-300 hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white;
    }
    .popover-button-connect {
        @apply bg-blue-500 px-1 items-center flex rounded-md focus:outline-none focus:ring-2 hover:text-black focus:ring-offset-2 focus:ring-offset-gray-800 focus:bg-indigo-300 focus:ring-white;
    }
    .popover-button-warning {
        @apply bg-red-500 px-1 items-center flex rounded-md focus:outline-none focus:ring-2 hover:text-black  focus:ring-offset-2 focus:ring-offset-gray-800 focus:bg-red-200 focus:ring-white;
    }
    .popover-panel {
        @apply origin-top-right overflow-hidden absolute w-screen sm:w-auto p-5 text-sm right-0 mt-2 rounded-lg shadow-lg bg-white text-black ring-1 ring-black ring-opacity-5 focus:outline-none z-50;
    }
    .status-icon {
        @apply text-green-400 h-5 w-5;
    }
    .status-icon-connect {
        @apply text-white hover:text-black h-5 w-5 ;
    }
    .status-icon-warning {
        @apply text-white hover:text-black h-5 w-5;
    }
    .status-text-connect {
        @apply text-white hover:text-black ml-1 mr-2 ;
    }
    .status-text-warning {
        @apply text-white hover:text-black text-lg ml-1 mr-2 ;
    }
    .status-text {
        @apply text-gray-100 hover:text-black text-xs font-thin ml-1 ;
    }
    .fadeslide-enter-active {
        @apply transition transform ease-out duration-300;
    }
    .fadeslide-enter-from {
        @apply  opacity-0 scale-0;
    }
    .fadeslide-enter-to {
        @apply  opacity-100 scale-100 ;
    }
    .fadeslide-leave-active {
        @apply transition ease-in duration-100;
    }
    .fadeslide-leave-from {
        @apply transform scale-100 opacity-100;
    }
    .fadeslide-leave-to {
        @apply transform opacity-0 scale-0;
    }
</style>
