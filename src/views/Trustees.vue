<!--
    The primary view of trusts "for you" (this is designed for the beneficiaries )
-->
<template>
<div class="bg-gradient-to-b from-gray-100 to-white">    
    <!-- 
        When empty, display some helpful text
    --> 
    <ConnectBlock class="pt-10" v-if="bc.connectionState.value !== state.Connected" />
    
    <div v-else-if="bc.connectionState.value === state.Connected">
        <ForTrustee></ForTrustee>
    </div>
</div>
</template>

<script setup lang="ts">

// Components
import ForTrustee from '../components/ForTrustee.vue';
import ConnectBlock from '../components/ConnectBlock.vue';

// Services
import { useBlockchainConnect, ConnectionState } from '../services/BlockchainConnect';

const bc = useBlockchainConnect();
const state = ConnectionState;

</script>

<style scoped>

</style>