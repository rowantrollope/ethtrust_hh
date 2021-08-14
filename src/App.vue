<template>
    <Nav/>
    <router-view/>
</template>

<script setup lang="ts">

import { provide } from 'vue';

import Nav from './components/Nav.vue';

import BlockchainConnect from './services/BlockchainConnect';
import CurrencyExchange from './services/CurrencyExchange';

const bc: BlockchainConnect = new BlockchainConnect();
provide('BlockchainConnect', bc);

const exchange = new CurrencyExchange();
provide('exchange', exchange)


</script>

<style>
</style>
