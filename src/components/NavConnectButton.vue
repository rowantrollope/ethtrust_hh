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
            <button class="font-semibold">
                Connect Wallet
            </button>
        </div>

        <div v-else-if="bc.connectionState.value === state.Connected">
            <div class="flex items-center space-x-1">
                <!-- <Jazzicon class="-ml-1 mt-1" :address="0x012314151351395359153891359818351385893" :diameter="24"/> -->
                <div  class="p-1 shrink-0 rounded-full bg-stone-200 w-[26px] h-[26px]">
                    <img class="h-[18px]" :src="bc.walletIcon.value"/>
                </div>
                <!-- <UserCircleIcon class="text-blue-400 h-5 w-5" aria-hidden="true" /> -->
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
            <UserCircleIcon class="text-white hover:text-black h-5 w-5" aria-hidden="true" />
            <span>Not Connected</span>
        </div>

        <ChevronDownIcon v-if="!open" class="text-gray-300 h-3 w-3" aria-hidden="true" />
        <ChevronUpIcon v-else-if="open" class="text-gray-300 h-3 w-3" aria-hidden="true" />

    </PopoverButton>

    <transition name="fadeslide">
        <PopoverPanel class="origin-top-right absolute w-screen 
                    bg-white text-black dark:bg-slate-900
                    sm:w-max opacity-100 p-5 text-sm -right-2 sm:-right-1 mt-2 sm:mt-3 h-screen sm:h-auto sm:rounded-md shadow-md z-50">
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
                <div class="flex-col text-left vertical space-y-3 text-gray-500">
                    <div class="text-sm">
                        Connected to {{ networkName }}
                    </div>
                    <div class="border border-gray-300 rounded-md p-3">
                        <div class="items-center mb-2 flex space-x-2 text-base font-black">

                            <img class="h-[24px]" :src="bc.walletIcon.value"/>
                            <div class="text-black">{{bc.walletName.value}}</div>
                        </div>
                        <div class="ml-8">
                            Account #: <AddressField :address="bc.account.value"/>
                        </div> 
                        <div class="mt-2 ml-8">
                            Balance: {{ balance }} ETH &nbsp ({{eth2usd}} USD)
                        </div>
                            <SwitchGroup as="div" class=" cursor-pointer mt-3 text-gray-500 items-center flex ml-2">
                                <Switch v-model="store.state.autoConnect" class="ml-5 shrink-0 group relative rounded-full inline-flex items-center justify-center h-5 w-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <span aria-hidden="true" class="pointer-events-none absolute bg-white w-full h-full rounded-md" />
                                <span aria-hidden="true" :class="[store.state.autoConnect ? 'bg-green-500' : 'bg-gray-200', 'pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200']" />
                                <span aria-hidden="true" :class="[store.state.autoConnect ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none absolute left-0 inline-block h-5 w-5 border border-gray-200 rounded-full bg-white shadow transform ring-0 transition-transform ease-in-out duration-200']" />
                            </Switch>  
                            <SwitchLabel as="span" class="ml-2">
                                Remember this wallet
                            </SwitchLabel>                 
                            </SwitchGroup>
                    </div>
                    
                    <div class="border border-gray-300 rounded-md p-3">
                        <div class="text-base text-black font-black">
                            SmartContract
                        </div>
                        <div class="ml-8 mt-2">
                            Address: <AddressField v-if="list" :address="list.address.value"/>
                        </div>
                    </div>
                </div>
                <PopoverButton class="w-full mt-4 btn btn-danger" @click="onDisconnect">Disconnect {{bc.walletName.value}}</PopoverButton>
                <!-- <PopoverButton class="mt-2 w-full btn btn-primary" @click="onConnectNewWallet">Connect New Wallet</PopoverButton> -->
                <div class="mt-5 text-gray-500 justify-center border-t pt-5 flex ml-2">
                    <Switch v-model="store.state.developerMode" class="shrink-0 group relative rounded-full inline-flex items-center justify-center h-5 w-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <span aria-hidden="true" class="pointer-events-none absolute bg-white w-full h-full rounded-md" />
                        <span aria-hidden="true" :class="[store.state.developerMode ? 'bg-green-500' : 'bg-gray-200', 'pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200']" />
                        <span aria-hidden="true" :class="[store.state.developerMode ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none absolute left-0 inline-block h-5 w-5 border border-gray-200 rounded-full bg-white shadow transform ring-0 transition-transform ease-in-out duration-200']" />
                    </Switch>                   
                    <span class="ml-2 text-sm">Enable Developer Mode</span>
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
import { Popover, PopoverButton, PopoverPanel, Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue';
import { StatusOnlineIcon, StatusOfflineIcon, ChevronDownIcon, ChevronUpIcon, ShieldCheckIcon } from '@heroicons/vue/outline';
import { UserCircleIcon } from '@heroicons/vue/solid';

// components
import AddressField from './AddressField.vue';

// services
import { useCurrencyExchange } from '../services/CurrencyExchange';
import { useBlockchainConnect, ConnectionState } from '../services/BlockchainConnect';
import { useTrustList } from '../services/TrustList';
import { useStore } from '../store';

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

const bc = useBlockchainConnect();
const list = useTrustList();
const store = useStore();

const exchange = useCurrencyExchange();
const balance = ref('0');

const onClicked = () => {
    bc.getBalanceString(4).then(val => 
        balance.value = val 
    );
}

const onDisconnect = () => {
    store!.state.autoConnect = false;
    store!.state.lastWallet = "";

    window.localStorage.setItem('lastNetworkId', "");

    window.location.reload();
}
const connectBlockchain = inject('connectBlockchain');

const eth2usd = computed(() => exchange ? exchange.eth2usdFormatted(Number(balance.value)) : "" );

</script>

<style>
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
