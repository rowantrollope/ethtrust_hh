<!--
    Landing page
-->
<template>
<div class="relative bg-white overflow-hidden">
    <div class="max-w-7xl mx-auto">

        <div v-if="bc?.connectionState.value === state.Connected && list && list.trusts.value" class="relative z-10 pb-8 sm:pb-16 md:pb-20 xl:max-w-2xl xl:w-full xl:pb-32">

            <!-- PAGE - WELCOME -- ZERO TRUSTS FOUND 
            -->
            <main v-if="grantorTrusts + beneficiaryTrusts + trusteeTrusts === 0" 
                class="mt-5 sm:mt-10 mx-auto max-w-7xl px-4 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div class="sm:text-center xl:text-left">
                <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span class="block xl:inline">Finally, an easy way to safely hand down crypto assets to</span>
                    {{ ' ' }}
                    <span class="block text-indigo-600 xl:inline">your family</span>
                </h1>
                <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl xl:mx-0">
                    Safely transfer your crypto assets to your family and loved ones taking advantage of the tax advantages of irrevokable trust funds.
                </p>
                <p class="hidden mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl xl:mx-0">                
                    All crypto assets placed into trust can be invested in one of three DeFi funds so your assets grow over time. 
                </p>
                <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl xl:mx-0">
                    Trusted.eth uses SmartContracts on the Ethereum blockchain to provide your family a simple and automated way to setup and maintain trust funds for your family.  
                </p>
                <p class="mt-3 font-black text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl xl:mx-0">
                    No paperwork.  No Banks.  No middlemen.
                </p>
                <div class="mt-5 sm:mt-8 sm:flex sm:justify-center xl:justify-start">
                    <div class="rounded-md shadow">
                    <a @click="$router.push('/Manage')" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                        Get started
                    </a>
                    </div>
                    <div class="mt-3 sm:mt-0 sm:ml-3">
                    <button @click="$router.push('/About')" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10">
                        How it works
                    </button>
                    </div>
                </div>
                </div>
            </main>

            <!-- PAGE - WELCOME -- GRANTOR TRUSTS FOUND 
            -->
            <main v-else-if="grantorTrusts > 0" 
                class="mt-5 sm:mt-10 mx-auto max-w-7xl px-4 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div class="sm:text-center xl:text-left">
                <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span class="block xl:inline">Welcome back to SAFE<span class="font-light">TRUST</span>, simple and secure crypto  </span>
                    {{ ' ' }}
                    <span class="block text-indigo-600 xl:inline">trust funds</span>
                </h1>
                <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl xl:mx-0">
                    Safely transfer your crypto assets to your family and loved ones taking advantage of the tax advantages of irrevokable trust funds.
                </p>
                <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl xl:mx-0">
                    Trusted.eth uses SmartContracts on the Ethereum blockchain to provide your family a simple and automated way to setup and maintain trust funds for your family.  
                </p>
                <p class="mt-3 font-black text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl xl:mx-0">
                    We've found {{ grantorTrusts }} trust funds created by your account. Click Let's Go or "Manage Trusts" above.
                </p>
                <div class="mt-5 sm:mt-8 sm:flex sm:justify-center xl:justify-start">
                    <div class="rounded-md shadow">
                    <a @click="$router.push('/Manage')" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                        Let's Go!
                    </a>
                    </div>
                    <div class="mt-3 sm:mt-0 sm:ml-3">
                    <button @click="$router.push('/About')" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10">
                        Learn more
                    </button>
                    </div>
                </div>
                </div>
            </main>

            <!-- PAGE - WELCOME -- BENEFICIARIES 
            -->
            <main v-else-if="beneficiaryTrusts > 0" 
                class="mt-5 sm:mt-10 mx-auto max-w-7xl px-4 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div class="sm:text-center xl:text-left">
                <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span class="block xl:inline">Welcome to SAFE<span class="font-light">TRUST</span>, simple and secure crypto  </span>
                    {{ ' ' }}
                    <span class="block text-indigo-600 xl:inline">trust funds</span>
                </h1>
                <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl xl:mx-0">
                    Woohoo! We've found {{ beneficiaryTrusts }} trust funds for your account, where you are listed as a beneficiary.
                </p>
                <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl xl:mx-0">                
                    This site will walk your though the simple process to access your trust fund<span v-if="beneficiaryTrusts > 1">s</span>, get reports, and find out what's next. 
                </p>
                <p class="mt-3 font-black text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl xl:mx-0">
                    Ready to access your trust funds?
                </p>
                <div class="mt-5 sm:mt-8 sm:flex sm:justify-center xl:justify-start">
                    <div class="rounded-md shadow">
                    <a @click="$router.push('/Beneficiaries')" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                        Lets Go!
                    </a>
                    </div>
                    <div class="mt-3 sm:mt-0 sm:ml-3">
                    <button @click="$router.push('/About')" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10">
                        Learn More
                    </button>
                    </div>
                </div>
                </div>
            </main>

            <!-- PAGE - WELCOME -- TRUSTEES 
            -->
            <main v-else-if="trusteeTrusts > 0" 
                class="mt-5 sm:mt-10 mx-auto max-w-7xl px-4 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div class="sm:text-center xl:text-left">
                <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span class="block xl:inline">Welcome to SAFE<span class="font-light">TRUST</span>, simple and secure crypto  </span>
                    {{ ' ' }}
                    <span class="block text-indigo-600 xl:inline">trust funds</span>
                </h1>
                <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl xl:mx-0">
                    Great News!  You have been designated as a <b>trustee</b> for {{ trusteeTrusts }} trust fund<span v-if="trusteeTrusts > 1">s</span>.
                </p>
                <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl xl:mx-0">                                    
                    This site will walk your though the simple process to manage all trust funds assigned to you as a trustee, distribute crpto to beneficiaries, deposit, withdraw, manage and more.
                </p>
                <p class="mt-3 font-black text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl xl:mx-0">
                    Ready to get started? 
                </p>
                <div class="mt-5 sm:mt-8 sm:flex sm:justify-center xl:justify-start">
                    <div class="rounded-md shadow">
                    <a @click="$router.push('/Trustees')" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                        Lets Go!
                    </a>
                    </div>
                    <div class="mt-3 sm:mt-0 sm:ml-3">
                    <button @click="$router.push('/About')" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10">
                        Learn More
                    </button>
                    </div>
                </div>
                </div>
            </main>

        </div>
    </div>
    <div class="xl:absolute xl:inset-y-0 xl:right-0 xl:w-1/2">
        <img class="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="https://images.unsplash.com/photo-1476703993599-0035a21b17a9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmFtaWx5JTIwa2lkc3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=60" alt="" />
    </div>
</div>
</template>

<script setup lang="ts">

import { inject, ref, computed, } from 'vue';

import router from '../router';

import UserDirection from '../components/UserDirection.vue';
import { BlockchainConnect, ConnectionState } from '../services/BlockchainConnect';
import TrustList from '../services/TrustList';
import { Trust } from '../services/Trust';

const state = ConnectionState;
const bc: BlockchainConnect | undefined = inject ("BlockchainConnect");
const list: TrustList | undefined = inject("TrustList");

const trusteeTrusts = computed(() => {
    if(list?.trusts.value) {
        return list!.trusts.value?.filter(trust => 
            -1 !== trust.trustees.findIndex(trustee => 
                trustee.toUpperCase() === bc!.account.value.toUpperCase()
            )).length;
    } else return 0;   
});

const grantorTrusts = computed(() => {
    if(list?.trusts.value) {
        return list!.trusts.value?.filter(trust => trust.grantor.toUpperCase() === bc!.account.value.toUpperCase() ).length;
    } else return 0; 
});
const beneficiaryTrusts = computed(() => {
    if(list?.trusts.value) {
        return list!.trusts.value?.filter(trust => trust.beneficiary.toUpperCase() === bc!.account.value.toUpperCase() ).length;
    } else return 0; 
});


</script>