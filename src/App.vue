<template>
    <div class="bg-white">
        <Nav/>
        <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
                <component :is="Component" />
            </transition>
        </router-view>
        <Footer/>
    </div>
</template>

<script setup lang="ts">

import { provide, onBeforeMount } from 'vue';
import Nav from './components/Nav.vue';
import Footer from './components/Footer.vue';

import { provideBlockchainConnect } from './services/BlockchainConnect';
import { provideTrustList } from './services/TrustList';
import { provideCurrencyExchange } from './services/CurrencyExchange';
import { provideStore } from './store';
import Trust from './services/Trust';

const bc = provideBlockchainConnect();
const list = provideTrustList();
const exchange = provideCurrencyExchange();
const store = provideStore();

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
