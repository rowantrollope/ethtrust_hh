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
    We found {{ stats.trusteeTrusts.value }} trust funds for you as a TRUSTEE.  <a @click="$router.push('/Trustees')" class="btn btn-success">Show me!</a>
</TopAlert>

<div class="relative overflow-hidden">
    <div class=" ">

        <main class="mt-5 sm:mt-10 mx-auto px-4 sm:px-6 md:mt-12 lg:mt-16 lg:px-8 xl:mt-24 mb-10">
            <div class="sm:text-center xl:text-center xl:w-1/2 xl:pr-8">
            <h1 class="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl xl:pr-5">
                <span class="block xl:inline">Finally, an easy way to safely pass down crypto assets to</span>
                {{ ' ' }}
                <span class="block text-indigo-600 xl:inline">your family and loved ones</span>
            </h1>
            <p class="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg md:mt-5 md:text-xl xl:mx-0">
                Safely transfer your crypto assets to your family and loved ones taking advantage of the tax advantages of irrevocable trust funds.
            </p>
            <p class="hidden mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg md:mt-5 md:text-xl xl:mx-0">                
                All crypto assets placed into trust can be invested in one of three DeFi funds so your assets grow over time. 
            </p>
            <p class="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg md:mt-5 md:text-xl xl:mx-0">
                Trusted.eth uses SmartContracts on the Ethereum blockchain to provide your family a simple and automated way to setup and maintain trust funds for your family.  
            </p>
            <p class="mt-3 font-black text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg  md:mt-5 md:text-xl xl:mx-0">
                Protect your crypto NOW
            </p>
            <div class="mt-5 sm:mt-8 sm:flex sm:justify-center xl:justify-center">
                <div class="rounded-md shadow">
                <button @click="$router.push('/Manage')" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                    Get started
                </button>
                </div>
                <div class="mt-3 sm:mt-0 sm:ml-3">
                <button @click="$router.push('/About')" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10">
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

import { ref } from 'vue';

// components
import router from '../router';

// services
import { useBlockchainConnect, ConnectionState } from '../services/BlockchainConnect';
import { useTrustStats } from '../services/TrustStats';

import TopAlert from '../components/TopAlert.vue';

const state = ConnectionState;
const bc = useBlockchainConnect();
const stats = useTrustStats();

const bgClass = ref("bg-blue-500");
const buttonClass = ref("btn-black");

const afterEnter = () => {
    setTimeout(() => {
        bgClass.value = "bg-black fade";
        buttonClass.value = 'btn-primary';
    }, 1000)
}

</script>

<style scoped>

.slide-enter-active {
    @apply transition-all duration-1000 ease-in;
}

@keyframes bgFade {
  from {background-color: rgba(59, 130, 246);}
  to {background-color: black;}
}
.fade {
    animation-name: bgFade;
    animation-duration: 3s;
    animation-delay: 0s;
}
.slide-leave-active {
    @apply transition-all duration-1000 ease-in;
}

.slide-enter-to, .slide-leave-from {
   max-height: 1000px;
   overflow: hidden;
   opacity: 100%;
}

.slide-enter-from {
   overflow: hidden;
   max-height: 0px;
   opacity: 0%;
}

.slide-leave-to {
    overflow: hidden;
    max-height: 100px;
    opacity: 100%;
    @apply bg-black
}
</style>