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
            <button class="flex items-center font-bold space-x-1">
                <span>Connect Wallet</span>
            </button>
        </div>

        <div v-else-if="bc.connectionState.value === state.Connected">
            <div class="flex items-center space-x-1">
                <!-- <Jazzicon class="-ml-1 mt-1" :address="0x012314151351395359153891359818351385893" :diameter="24"/> -->
                <StatusOnlineIcon class="text-green-400 h-5 w-5" aria-hidden="true" />
                <span>{{bc.walletName.value + ' @ ' + networkNameShort}}</span>
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
                <div class="space-y-2 w-full">
                    <div class="text-xl font-thin justify-center flex">
                        Let's get started!
                    </div>
                    <div class="flex justify-center">
                        <PopoverButton class="w-full btn btn-primary" @click="connectBlockchain">Connect Wallet</PopoverButton>
                    </div>
                </div>
            </div>
            <div v-else-if="bc.connectionState.value === state.Connected">
                <div class="flex-col text-left vertical space-y-3">
                    <div class="flex items-center space-y-3 text-sm">
                        <StatusOnlineIcon class="h-6 w-6 text-green-500"/> &nbsp;Connected to {{ networkName }}
                    </div>
                    <div class="border border-gray-300 rounded-md p-3">
                        <div class="items-center flex space-x-2 text-base font-black">

                            <img style="height: 22px " :src="bc.walletIcon.value"/>
                            <div>{{bc.walletName.value}}</div>
                        </div>
                        <div class="flex mt-2 ml-8">
                            <span class="text-gray-500">Account #:</span> 
                            <span class=""> &nbsp;<AddressField :address="bc.account.value"/></span>
                        </div>
                        <div class="flex mt-2 ml-8">
                            <span class="text-gray-500">Balance:</span> 
                            <span class=""> &nbsp;{{ balance }} ETH </span>
                        </div>
                        <div class="mt-3 text-gray-500 items-center flex ml-2">
                            <input type="checkbox" v-model="autoConnect" class=""/>
                            <span class="ml-2 text-xs">Automatically connect this wallet </span>
                        </div>
                    </div>
                    
                    <div class="border border-gray-300 rounded-md p-3">
                        <div class="items-center flex space-x-2 text-base font-black">
                            SmartContract
                        </div>
                        <p class="flex ml-5 mt-2">
                            <span class="text-gray-500">Address:</span> 
                            <AddressField :address="list.address.value"/>
                        </p>
                    </div>
                    <p class="flex-grow">
                    </p>
                </div>
                <PopoverButton class="flex w-full mt-4 btn btn-danger-outline" @click="onDisconnect">Disconnect {{bc.walletName.value}}</PopoverButton>
                <PopoverButton class="mt-2 w-full btn btn-primary" @click="onConnectNewWallet">Connect New Wallet</PopoverButton>
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
import { ref, Ref, inject, watch, computed, onUpdated } from 'vue';

// 3rd party Components
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import { StatusOnlineIcon, StatusOfflineIcon, ChevronDownIcon, ChevronUpIcon, ShieldCheckIcon } from '@heroicons/vue/outline';

// components
import AddressField from './AddressField.vue';

// services
import CurrencyExchange from '../services/CurrencyExchange';
import { BlockchainConnect, ConnectionState } from '../services/BlockchainConnect';
import TrustList from '../services/TrustList';

let networkStrings = new Map([
    [1, { short: "Mainnet", long: "Ethereum Mainnet" }],
    [3, { short: "Ropsten", long: "Ropsten Test Network"}],
    [4, { short: "Rinkeby", long: "Rinkeby Test Network"}],
    [42, {short: "Kovan", long: "Kovan Test Network"}],
    [1337, { short: "Hardhat", long: "Hardhat Localhost"}],
]);
const networkName = computed(() => {
    if(networkStrings.has(bc.chainId)) {
        const item = networkStrings.get(bc.chainId);
        return item ? item.long : "";
    }
    else
        return "Unknown Network";
});
const networkNameShort = computed(() => {
    if(networkStrings.has(bc.chainId)) {
        const item = networkStrings.get(bc.chainId);
        return item ? item.short : "";
    } else
        return "Unknown";
});

const state = ConnectionState;

const bc: BlockchainConnect = <BlockchainConnect> inject('BlockchainConnect');
const list: TrustList = <TrustList> inject('TrustList');
const autoConnect = ref(inject('autoConnect') as boolean);

const exchange = <CurrencyExchange> inject('exchange');
const balance = ref('0');

onUpdated(() => {
    
    console.log("setting autoconnect to: ", autoConnect.value);
})

watch(autoConnect, () => {
    console.log("autoConnect changed", autoConnect.value);
    window.localStorage.setItem('autoConnect', autoConnect.value ? "true" : "false");
})
const onClicked = () => {
    bc.getBalanceString(4).then(val => 
        balance.value = val 
    );
}
const onDisconnect = () => {
    window.localStorage.setItem('autoConnect', "false");
    window.localStorage.setItem('selectedWallet', "");
    window.localStorage.setItem('lastNetworkId', "");

    window.location.reload();
}
const onConnectNewWallet = () => bc.connectNewWallet();
const connectBlockchain = inject('connectBlockchain');

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
