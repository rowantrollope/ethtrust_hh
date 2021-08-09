<template>
    <Trusts/>
</template>

<script setup lang="ts">

import { onBeforeMount, provide } from 'vue';

import BlockchainConnect from './services/BlockchainConnect'
import Trusts from './components/Trusts.vue';
import CurrencyExchange from './services/CurrencyExchange'

const exchange = new CurrencyExchange();
const bc: BlockchainConnect = new BlockchainConnect();

provide('BlockchainConnect', bc);
provide('exchange', exchange)

</script>

<style>
</style>
