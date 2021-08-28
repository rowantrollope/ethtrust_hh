
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
    <div v-else-if="bc.connectionState.value === state.NotConnected" 
        class="ml-20 text-2xl mt-10 tracking-tight font-extrabold text-gray-900">
        <div class="flex items-center space-x-5 mt-10">
            <span class="block text-indigo-600">Click </span>
            <button class="btn btn-rounded btn-success" @click="onConnect">Start</button>
            <span class="block text-indigo-600">to connect your wallet</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { BlockchainConnect, ConnectionState } from '../services/BlockchainConnect';

let bc: BlockchainConnect = <BlockchainConnect> inject("BlockchainConnect");

const state = ConnectionState;

const onConnect = async () => {
    console.log("onConnect");
    bc.connect();
}

</script>
