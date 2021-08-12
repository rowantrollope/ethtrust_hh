<template>
    <Trusts/>
</template>

<script setup lang="ts">

import { provide } from 'vue';

import BlockchainConnect from './services/BlockchainConnect';
import CurrencyExchange from './services/CurrencyExchange';

const bc: BlockchainConnect = new BlockchainConnect();
provide('BlockchainConnect', bc);

const exchange = new CurrencyExchange();
provide('exchange', exchange)

import Trusts from './components/Trusts.vue';


</script>

<style>
</style>
