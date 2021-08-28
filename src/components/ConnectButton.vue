<!--
    Handles the "Connected" button to display the state of the connection to the blockchain / metamask
    
    Currently handles three states: Connect, Connected and Error.
    
    TODO: Add animation for transitions.    
-->
<template>
    <Popover class="relative">

        <PopoverButton v-if="bc.connectionState.value === state.Connected" class="h-7 text-white px-1 font-thin items-center flex text-xs rounded-full hover:bg-black hover:text-white focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" @click="onClicked()">
            <!-- <Jazzicon class="-ml-1 mt-1" :address="bc.account.value" :diameter="24"/> -->
            <StatusOnlineIcon class="text-green-400 h-5 w-5" aria-hidden="true" />
            <span class="ml-1">Connected</span>
            <!-- <ChevronDownIcon class="text-black -ml-1 h-6 w-6" aria-hidden="true" /> -->
        </PopoverButton>

        <PopoverButton v-else-if="bc.connectionState.value === state.Connecting" class="h-7 text-white px-1 font-thin items-center flex text-xs rounded-full hover:bg-black hover:text-white focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" v-on:click.prevent="onClicked()">
            <StatusOnlineIcon class="text-white hover:text-black h-5 w-5" aria-hidden="true" />
            <span class="text-white hover:text-black ml-1 mr-2">Connecting...</span>
        </PopoverButton>

        <PopoverButton v-else-if="bc.connectionState.value === state.Error" class="bg-red-500 px-1 items-center flex rounded-md focus:outline-none focus:ring-2 hover:text-black  focus:ring-offset-1 focus:ring-offset-gray-800 focus:bg-red-200 focus:ring-white" @click="onClicked()">
            <StatusOnlineIcon class="text-white hover:text-black h-5 w-5" aria-hidden="true" />
            <span class="text-gray-100 hover:text-black text-xs font-thin ml-1 ">Not Connected </span>
        </PopoverButton>

        <transition name="fadeslide">
            <PopoverPanel class="origin-top-right absolute w-screen sm:w-max opacity-90 p-5 text-sm -right-2 sm:right-0 mt-2 sm:mt-3 h-screen sm:h-auto sm:rounded-md shadow-md bg-black text-white z-50">
                <div v-if="bc.connectionState.value === state.Connected">
                    <div class="flex-col text-left vertical space-y-3">
                        <div class="flex items-center space-y-3 text-lg ">
                            <StatusOnlineIcon class="h-6 w-6 text-green-500"/> &nbsp;Blockchain Connected
                        </div>
                        <div class="flex">
                            Account: <span class=""> &nbsp;<AddressField :address="bc.account.value"/></span>
                        </div>
                        <div class="flex">
                            Balance: <span class=""> &nbsp;{{ balance }} ETH </span>
                        </div>
                        <div class="flex">
                            Network ID:<span class=""> &nbsp;{{ bc.chainId }} </span>
                        </div>
                        <div class="flex">
                            Network Name:<span class=""> &nbsp;{{ bc.chainName }} </span>
                        </div>
                        <p class="flex">
                            Trust Contract: <span class=""> &nbsp; {{ list.address.value }} </span> 
                        </p>
                    </div>
                </div>
                <div v-else-if="bc.connectionState.value === state.Error" class="flex-col vertical space-y-5">
                    <p class="flex text-xl border text-red-500 border-red-500 p-2 rounded-md ">
                        Failed to connect to the Blockchain
                    </p>
                    <p>
                        Error Message: {{ bc.connectionError.value }}
                    </p>
                    <p class="flex">
                        Account: &nbsp; <b> {{ bc.account.value }} } </b>
                    </p>
                    <p class="flex">
                        Trust Contract: &nbsp; <b> {{ list.address }} } </b>
                    </p>
                    <div class="text-right">
                    <button class="btn btn-primary" @click="onClicked()">Try Again</button>
                    </div>
                </div>
            </PopoverPanel>
        </transition>
    </Popover>
</template>

<script setup lang="ts">
import { ref, inject, computed, onMounted } from 'vue';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import { StatusOnlineIcon, ShieldCheckIcon } from '@heroicons/vue/outline';

import AddressField from './AddressField.vue';

import CurrencyExchange from '../services/CurrencyExchange';
import { BlockchainConnect, ConnectionState } from '../services/BlockchainConnect';
import TrustList from '../services/TrustList';

const state = ConnectionState;

const bc: BlockchainConnect = <BlockchainConnect> inject('BlockchainConnect');
const list: TrustList = <TrustList> inject('TrustList');

const exchange = <CurrencyExchange> inject('exchange');
const balance = ref('0');

const onClicked = () => {
    bc.getBalanceString(4).then(val => 
        balance.value = val 
    );
}

const eth2usd = computed(() => exchange ? exchange.eth2usdFormatted(Number(balance.value)) : "" );

</script>

<style scoped>

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
