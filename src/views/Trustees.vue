<!--
    The primary view of trusts "for you" (this is designed for the beneficiaries )
-->
<template>
<div class="">    
    <!-- 
        When empty, display some helpful text
    --> 
    <ConnectBlock class="pt-10" v-if="bc.connectionState.value !== state.Connected" />
    
    <div v-else-if="bc.connectionState.value === state.Connected">
        <ViewForTrustee/>
    </div>
</div>
</template>

<script setup lang="ts">

// Components
import ViewForTrustee from '../components/ViewForTrustee.vue';
import ConnectBlock from '../components/BlockchainConnectHelp.vue';

// Services
import { useBlockchainConnect, ConnectionState } from '../services/BlockchainConnect';

const bc = useBlockchainConnect();
const state = ConnectionState;

</script>

<style scoped>

</style>