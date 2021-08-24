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
    
        let filtered: Array<Trust> | undefined;

        // Count trusts by role
        filtered = list.trusts.value?.filter(trust => trust.grantor.toUpperCase() === bc.account.value.toUpperCase() );
        const grantorTrusts: number = filtered ? filtered.length : 0;

        filtered = list.trusts.value?.filter(trust => trust.beneficiary.toUpperCase() === bc.account.value.toUpperCase() );
        const beneficiaryTrusts: number = filtered ? filtered.length : 0;
        
        filtered = list.trusts.value?.filter(trust => 
                -1 !== trust.trustees.findIndex(trustee => 
                    trustee.toUpperCase() === bc.account.value.toUpperCase()
                )
            );
        const trusteeTrusts: number = filtered ? filtered.length : 0;
        
        console.log(`Trusts counts: Grantors: ${grantorTrusts}, Beneficiaries: ${beneficiaryTrusts}, Trustees ${trusteeTrusts}`);

    }
    
}

</script>

<style>
</style>
