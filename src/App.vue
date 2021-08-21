<template>
    <Nav/>
    <router-view/>
</template>

<script setup lang="ts">

import { provide, ref, onBeforeMount } from 'vue';
import Nav from './components/Nav.vue';

import BlockchainConnect from './services/BlockchainConnect';
import TrustList from './services/TrustList';

import CurrencyExchange from './services/CurrencyExchange';

const bc: BlockchainConnect = new BlockchainConnect();
provide('BlockchainConnect', bc);

const list: TrustList = new TrustList();
provide('TrustList', list);

const exchange = new CurrencyExchange();
provide('exchange', exchange)

const loaded = ref(false);
provide ("loaded", loaded);

const beforeMount = onBeforeMount(() => {
    connect();
});

const connect = async () => {
    await bc.connect();
    if(bc!.signer) {
        await list.connect(bc!.signer);
        await list.getTrusts((trust: Trust) => true );
    }
    await exchange.init();
    loaded.value = true;
}

</script>

<style>
</style>
