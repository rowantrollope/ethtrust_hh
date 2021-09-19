<template>
<div class="bg-white">

    <Nav/>
    <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
            <component :is="Component" />
        </transition>
    </router-view>
</div>
</template>

<script setup lang="ts">

import { provide, ref, onBeforeMount } from 'vue';
import Nav from './components/Nav.vue';

import { BlockchainConnect } from './services/BlockchainConnect';
import TrustList from './services/TrustList';
import Trust from './services/Trust';

import CurrencyExchange from './services/CurrencyExchange';

const bc: BlockchainConnect = new BlockchainConnect();
provide('BlockchainConnect', bc);

const list: TrustList = new TrustList();
provide('TrustList', list);

const exchange = new CurrencyExchange();
provide('exchange', exchange)

const contractAddress = ref("");
provide ('contractAddress', contractAddress);

let autoConnect = false;

onBeforeMount(() => {
    exchange.init();

    let ac = window.localStorage.getItem('autoConnect');
    autoConnect = ac ? ac === "true" : false;
    provide ('autoConnect', autoConnect);

    if(autoConnect)
        connectBlockchain() 
});

const connectBlockchain = async () => {
    
    await bc.connect();

    if(bc!.signer) {
        await list.connect(bc!.signer);
        await list.getTrusts((trust: Trust) => true ); 
        contractAddress.value = list.address.value;
    }

}
provide ('connectBlockchain', connectBlockchain);

</script>

<style>

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
   opacity: 0%;
}

</style>
