<template>

<div class="mt-10 text-center text-6xl text-red-500 font-black">
    <div v-if="loaded" >
        {{ trustCount }} <br/>
        <div class="text-base font-normal">{{ trustKey }}</div>
    </div>
    <div v-else>
        Loading...
    </div>
    <button class="text-lg font-normal bg-green-500 rounded-lg text-white hover:bg-green-300 p-2" :onClick="createTrust">Create a trust</button>
    <button class="text-lg font-normal bg-green-500 rounded-lg text-white hover:bg-green-300 p-2" :onClick="getTrust">READ a trust</button>
</div>

</template>

<script setup="props" lang="ts">
import { onBeforeMount, ref } from 'vue';
import { ethers } from 'ethers';
import { BigNumber} from "@ethersproject/bignumber";
import BlockchainConnect from '../services/BlockchainConnect';

import Trust from "../services/Trust"
import TrustContract from '../services/TrustContract';

// BLOCKCHAIN connection and prep
let bc: BlockchainConnect;
let trusts: TrustContract;

// refs
const loaded = ref(false);
const trustCount = ref(0);
const trustKey = ref('none');

// props
const props = defineProps({
});

/**
 * METHODS
 */
const mounted = onBeforeMount(() => connect());

const connect = async () => {
    
    loaded.value = false;

    bc = new BlockchainConnect();

    await bc.connect();

    if(bc.signer) {
        trusts = new TrustContract(bc.signer);
        loaded.value = true;
        trustKey.value = await trusts.getTrustAtIndex(0);
        trustCount.value = await trusts.getTrustCount();
    }
    else 
        console.error("BC::connect() - Unable to connect to blockchain");

    bc.setOnChange((account: string) => { 
        console.log("Accounts Changed from: to: ", account.address);
    });

}
const createTrust = async () => {
    const amount: BigNumber = ethers.utils.parseEther("1");

    trusts.createTrust(bc.account, bc.account, "Test", 0, amount, bc.account);
}
const getTrust = async () => {
    const key = await trusts.getTrustAtIndex(0);
    const trust: Trust = await trusts.getTrust(key);
    console.log("READ trust", trust);

}
</script>

<style scoped>
</style>
