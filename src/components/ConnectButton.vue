<!--
    Handles the "Connected" button to display the state of the connection to the blockchain / metamask
    
    Currently handles three states: Connect, Connected and Error.
    
    TODO: Add animation for transitions.    
-->
<template>
<Popover class="relative" v-slot="{ open }">

    <PopoverButton  
        :class="open ? 'bg-black' : '' "
        class="text-white p-2 space-x-1 rounded-lg font-thin items-center flex text-xs hover:bg-black hover:text-white focus:outline-none " @click="onClicked()">

        <div v-if="bc.connectionState.value === state.Unknown">
            <div class="flex items-center space-x-1">
                <StatusOfflineIcon class="text-gray-300 ml-1 h-5 w-5" aria-hidden="true" />
                <span>Connect Wallet</span>
            </div>
        </div>

        <div v-else-if="bc.connectionState.value === state.Connected">
            <div class="flex items-center space-x-1">
                <!-- <Jazzicon class="-ml-1 mt-1" :address="0x012314151351395359153891359818351385893" :diameter="24"/> -->
                <StatusOnlineIcon class="text-green-400 h-5 w-5" aria-hidden="true" />
                <span>Connected</span>
            </div>
        </div>

        <div v-else-if="bc.connectionState.value === state.Connecting">
            <div class="animate-pulse flex items-center space-x-1">
                <StatusOfflineIcon class="text-white hover:text-black h-5 w-5" aria-hidden="true" />
                <span>Connecting...</span>
            </div>
        </div>

        <div v-else-if="bc.connectionState.value === state.Error">
            <StatusOnlineIcon class="text-white hover:text-black h-5 w-5" aria-hidden="true" />
            <span>Not Connected</span>
        </div>

        <ChevronDownIcon v-if="!open" class="text-gray-300 h-3 w-3" aria-hidden="true" />
        <ChevronUpIcon v-else-if="open" class="text-gray-300 h-3 w-3" aria-hidden="true" />

    </PopoverButton>

    <transition name="fadeslide">
        <PopoverPanel class="origin-top-right absolute w-screen bg-white text-black  sm:w-max opacity-100 p-5 text-sm -right-2 sm:-right-1 mt-2 sm:mt-3 h-screen sm:h-auto sm:rounded-md shadow-md z-50">
            <div v-if="bc.connectionState.value === state.Unknown" class="flex items-center space-x-2">
                <div class="text-xl font-thin">
                    Connect your wallet
                </div>
                <button class="btn btn-primary">Connect Now</button>
            </div>
            <div v-else-if="bc.connectionState.value === state.Connected">
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
import { ref, inject, computed } from 'vue';

// 3rd party Components
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import { StatusOnlineIcon, StatusOfflineIcon, ChevronDownIcon, ChevronUpIcon, ShieldCheckIcon } from '@heroicons/vue/outline';

// components
import AddressField from './AddressField.vue';

// services
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
