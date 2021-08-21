
<template>
<!--
    Displays a Connect now option to user (currently disabled) to allow for manual connection
    to blockchain services.  TODO: Remember previous state with a cookie and auto-reconnect for 
    returning users, and manually display this text for first time users.
-->    <div v-if="!bc.loaded">
        <h1 class="text-4xl mt-10 ml-5 tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span class="block inline">Lets get you started! </span>
        </h1>
        <div class="ml-20 text-2xl mt-10 tracking-tight font-extrabold text-gray-900">
            <div class="flex items-center space-x-5 mt-10">
                <span class="block text-indigo-600">Click </span>
                <Button class="btn-rounded btn-success" @click="onConnect">Start</Button>
                <span class="block text-indigo-600">to connect your wallet</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import Button from './Button.vue';
import BlockchainConnect from '../services/BlockchainConnect';

let bc: BlockchainConnect = <BlockchainConnect> inject("BlockchainConnect");

const onConnect = async () => {
    console.log("onConnect");
    if(!bc.loaded.value) {
        bc.connect();
    }
}

</script>
