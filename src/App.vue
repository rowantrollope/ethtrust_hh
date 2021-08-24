<template>
    <Nav/>
    <router-view/>
</template>

<script setup lang="ts">

import { provide, ref, onBeforeMount } from 'vue';
import Nav from './components/Nav.vue';

import { BlockchainConnect } from './services/BlockchainConnect';
import TrustList from './services/TrustList';
import { Trust } from './services/Trust';

import CurrencyExchange from './services/CurrencyExchange';

const bc: BlockchainConnect = new BlockchainConnect();
provide('BlockchainConnect', bc);

const list: TrustList = new TrustList();
provide('TrustList', list);

const exchange = new CurrencyExchange();
provide('exchange', exchange)

const beforeMount = onBeforeMount(() => {
    connect();
});

const connect = async () => {
  
    await exchange.init();

    await bc.connect();

    if(bc!.signer) {
                
        await list.connect(bc!.signer);

        await list.getTrusts((trust: Trust) => true );
    
    }
    
}

</script>

<style>
</style>
