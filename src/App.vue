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

import { provide, ref, watch, inject, onBeforeMount } from 'vue';
import Nav from './components/Nav.vue';

import { bcSymbol, createBlockchainConnect } from './services/BlockchainConnect';
import TrustList from './services/TrustList';
import Trust from './services/Trust';
import { createStore, storeSymbol } from './store';

import CurrencyExchange from './services/CurrencyExchange';

const bc = createBlockchainConnect();
provide(bcSymbol, bc);

const list: TrustList = new TrustList();
provide('TrustList', list);

const exchange = new CurrencyExchange();
provide('exchange', exchange)

const contractAddress = ref("");
provide ('contractAddress', contractAddress);

const store = createStore();
provide(storeSymbol, store);

onBeforeMount(() => {

    exchange.init();

    if(store.state.autoConnect)
        connectBlockchain() 
    
});

const connectBlockchain = async () => {
    
    bc.setOnNetworkChange((networkId) => store.state.lastNetwork = networkId );
    bc.setOnWalletChange((wallet) => store.state.lastWallet = wallet );

    if(store.state.autoConnect)
        await bc.connect(store.state.lastWallet, store.state.lastNetwork);
    else
        await bc.connect(null, store.state.lastNetwork);

    if(bc!.signer) {
        await list.connect(bc!.signer);
        await list.getTrusts((trust: Trust) => true); 
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
