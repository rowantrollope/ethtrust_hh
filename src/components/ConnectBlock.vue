<template>
<!--
    Displays a Connect now option to user (currently disabled) to allow for manual connection
    to blockchain services.  TODO: Remember previous state with a cookie and auto-reconnect for 
    returning users, and manually display this text for first time users.
-->   
    <div v-if="bc.connectionState.value === state.Connecting">
        <div class="flex h-20 justify-center items-center">
            <div class="rounded animate-spin ease duration-300 w-5 h-5 border-2 border-black">
            </div><span class="ml-2">Connecting...</span>
        </div>        
    </div>
    <div v-else-if="bc.connectionState.value === state.Error">
        <div class="text-center mt-5 ml-5 ">
            <h1 class="text-3xl"> Oops! Something went wrong...</h1>
            
            <p class="mt-5">We aren't able to connect your browser to the blockchain... Please ensure that you have Metamask installed.</p>

            <p class="mt-5">Currently supported browsers are Chrome, Firefox and Brave.</p>  

            <p class="mt-5">Error string: {{ bc.connectionError.value }}</p>
            
        </div>
    </div>
    <div v-else-if="bc.connectionState.value === state.Unknown" 
        class="text-2xl mt-10 tracking-tight text-gray-900">
        <div class="flex justify-center">Connect your wallet to get started </div>
        <div class="flex justify-center items-center space-x-5 mt-10">
            <button class="btn btn-rounded btn-primary" @click="connectBlockchain">Connect Wallet</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';

// services
import { useBlockchainConnect, ConnectionState } from '../services/BlockchainConnect';

const bc = useBlockchainConnect();
const state = ConnectionState;
const connectBlockchain = inject("connectBlockchain");

</script>
