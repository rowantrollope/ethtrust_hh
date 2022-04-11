<!--
    Landing page
-->
<template>
<div>

<TopAlert :show="bc.connectionState.value === state.Connected && stats.isGrantor.value"
    @click="$router.push('/Manage')">
    We found {{ stats.grantorTrusts.value }} trust funds created by your account. <a class="btn btn-success" @click="$router.push('/Manage')">Show me!</a>
</TopAlert>

<TopAlert :show="bc.connectionState.value === state.Connected && stats.isBeneficiary.value"
    @click="$router.push('/Beneficiaries')">
    We found {{ stats.beneficiaryTrusts.value }} trust funds in your name as Beneficiary. <a @click="$router.push('/Beneficiaries')" class="btn btn-success ">Show me!</a>
</TopAlert>

<TopAlert :show="bc.connectionState.value === state.Connected && stats.isTrustee.value"
@click="$router.push('/Trustees')">
    We found {{ stats.trusteeTrusts.value }} trust fund(s) for you as a TRUSTEE.  <a @click="$router.push('/Trustees')" class="btn btn-success">Show me!</a>
</TopAlert>

<div class="relative overflow-hidden">
    <div class=" ">

        <main class="mt-5 sm:mt-10 mx-auto px-4 sm:px-6 md:mt-12 lg:mt-16 lg:px-8 xl:mt-24 mb-10">
            <div class="sm:text-left xl:text-left xl:w-1/2 xl:pr-8">
            <h1 class="text-4xl tracking-tight font-semibold sm:text-5xl md:text-6xl xl:pr-5">
                <span class="block">Safely and easily protect and transfer your 
                    <span class="relative ml-2 ">
                    <Transition name="slide-up" >
                        <span v-if="currentItem == 0" class="absolute text-black ">{{crypto}}</span>
                        <span v-else-if="currentItem == 1" class="absolute text-violet-400 ">{{crypto}}</span>
                        <span v-else-if="currentItem == 2" class="absolute text-violet-600">{{crypto}}</span>
                        <span v-else-if="currentItem == 3" class="absolute text-amber-500 ">{{crypto}}</span>
                        <span v-else-if="currentItem == 4" class="absolute text-amber-700">{{crypto}}</span>
                    </Transition> 
                    </span>                    
                </span>
                    
                {{ ' ' }}
                <span class="block text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-amber-500 xl:inline">
                    to your family and loved ones
                </span>
            </h1>
            <p class="mt-3 font-semibold text-gray-400 dark:text-gray-300 sm:mt-5 sm:text-lg md:mt-5 md:text-xl xl:mx-0">
                Safely transfer your crypto assets to your family and loved ones taking advantage of the tax advantages of irrevocable trust funds.
            </p>
            <p class="hidden mt-3 font-semibold text-gray-400  dark:text-gray-300 sm:mt-5 sm:text-lg md:mt-5 md:text-xl xl:mx-0">                
                All crypto assets placed into trust can be invested in one of three DeFi funds so your assets grow over time. 
            </p>
            <p class="mt-3 font-semibold text-gray-400 dark:text-gray-300 sm:mt-5 sm:text-lg md:mt-5 md:text-xl xl:mx-0">
                Trusted.eth uses SmartContracts on the Ethereum blockchain to provide your family a simple and automated way to setup and maintain trust funds for your family.  
            </p>
            <p class="mt-3 font-bold text-gray-500 dark:text-gray-100 sm:mt-5 sm:text-2xl  md:mt-5 md:text-xl xl:mx-0">
                Ready to dive in? <span class="">Create your first trust now</span>
            </p>
            <div class="mt-5 sm:mt-8 sm:flex sm:justify-center xl:justify-center">
                <div class="rounded-md shadow">
                <button @click="$router.push('/Manage')" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-300 md:py-4 md:text-lg md:px-10">
                    Get started
                </button>
                </div>
                <div class="mt-3 sm:mt-0 sm:ml-3">
                <button @click="$router.push('/About')" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10">
                    How it works
                </button>
                </div>
            </div>
            </div>
        </main>
    </div>
    <div class="xl:absolute xl:inset-y-0 xl:right-0 xl:w-1/2">
        <img class="h-full w-full object-cover sm:h-full md:h-full lg:w-full lg:h-full" src="https://images.unsplash.com/photo-1476703993599-0035a21b17a9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmFtaWx5JTIwa2lkc3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=60" alt="" />
    </div>
</div>

</div>

</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue';

// components
import router from '../router';

// services
import { useBlockchainConnect, ConnectionState } from '../services/BlockchainConnect';
import { useTrustStats } from '../services/TrustStats';

import TopAlert from '../components/TopAlert.vue';

const state = ConnectionState;
const bc = useBlockchainConnect();
const stats = useTrustStats();

const cryptoNames = [ "crypto", "bitcoin", "ethereum", "dogecoin", "solana" ];
const currentItem = ref(0);

const bgClass = ref("bg-blue-500");
const buttonClass = ref("btn-black");
const crypto = ref("crypto");

onMounted(() => {

    setTimeout(() => {
        rollCrypto();        
    }, 1500);
});

const rollCrypto = () => {
    if(currentItem.value == cryptoNames.length -1)
        currentItem.value = 0;
    else 
        currentItem.value++;
    
    crypto.value = cryptoNames[currentItem.value];
    
    setTimeout(() => {
        rollCrypto();
    }, 2500);
}
</script>

<style scoped>

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>