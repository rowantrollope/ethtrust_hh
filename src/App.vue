<template>
    <div>
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
import Nav from './components/TheNav.vue';
import Footer from './components/TheFooter.vue';

import { provideBlockchainConnect } from './services/BlockchainConnect';
import { provideTrustList } from './services/TrustList';
import TrustStats, { provideTrustStats } from './services/TrustStats';
import { provideCurrencyExchange } from './services/CurrencyExchange';
import { provideStore } from './store';
import Trust from './services/Trust';

const bc = provideBlockchainConnect();
const list = provideTrustList();
const exchange = provideCurrencyExchange();
const store = provideStore();
const stats = provideTrustStats();

onBeforeMount(() => {

    exchange.init();

    if(store.state.autoConnect)
        connectBlockchain() 
    
});

const connectBlockchain = async () => {
    
    bc.setOnNetworkChange((networkId) => store.state.lastNetwork = networkId );
    bc.setOnWalletChange((wallet) => store.state.lastWallet = wallet );
    bc.setOnAddressChange((address) => stats.load(list, address));

    if(store.state.autoConnect)
        await bc.connect(store.state.lastWallet, store.state.lastNetwork);
    else
        await bc.connect(null, store.state.lastNetwork);

    if(bc!.signer) {
        await list.connect(bc!.signer);
        await list.getTrusts((trust: Trust) => true); 
        
        stats.load(list, bc.account.value);
        console.log("STATS", stats);
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
