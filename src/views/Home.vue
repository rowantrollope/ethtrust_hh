<!--
    Landing page
-->
<template>

<TopAlert :show="bc?.connectionState.value === state.Connected && list && list.trusts.value && isGrantor"
    @click="$router.push('/Manage')">
    We found {{ grantorTrusts }} trust funds created by your account. <a @click="$router.push('/Manage')" class="text-blue-500 underline">Show me!</a>
</TopAlert>

<TopAlert :show="bc?.connectionState.value === state.Connected && list && list.trusts.value && isBeneficiary"
    @click="$router.push('/Beneficiaries')">
    We found {{ beneficiaryTrusts }} trust funds in your name as Beneficiary. <a @click="$router.push('/Beneficiaries')" class="text-blue-500 underline">Show me!</a>
</TopAlert>

<TopAlert :show="bc?.connectionState.value === state.Connected && list && list.trusts.value && isTrustee"
@click="$router.push('/Trustees')">
    We found {{ trusteeTrusts }} trust funds for you as a TRUSTEE.  <a @click="$router.push('/Trustees')" class="text-blue-500 underline">Show me!</a>
</TopAlert>

<div class="relative bg-white overflow-hidden">
    <div class="max-w-7xl mx-auto">

        <main class="mt-5 sm:mt-10 mx-auto max-w-7xl px-4 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28 mb-10">
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
        <div class="xl:absolute xl:inset-y-0 xl:right-0 xl:w-1/2">
            <img class="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="https://images.unsplash.com/photo-1476703993599-0035a21b17a9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmFtaWx5JTIwa2lkc3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=60" alt="" />
        </div>
    </div>
</div>


</template>

<script setup lang="ts">

import { inject, ref, computed, } from 'vue';

import router from '../router';

import ReturningUserPopup from '../components/ReturningUserPopup.vue';
import { BlockchainConnect, ConnectionState } from '../services/BlockchainConnect';
import TrustList from '../services/TrustList';
import { Trust } from '../services/Trust';
import TopAlert from '../components/TopAlert.vue';

const state = ConnectionState;
const bc: BlockchainConnect | undefined = inject ("BlockchainConnect");
const list: TrustList | undefined = inject("TrustList");
const showPopup = ref(true);
const bgClass = ref("bg-blue-500");
const buttonClass = ref("btn-black");

enum UserType {
    None = 0,
    Grantor,
    Beneficiary,
    Trustee,
}

const isGrantor = computed(() => user.value === UserType.Grantor )
const isTrustee = computed(() => user.value === UserType.Trustee )
const isBeneficiary = computed(() => user.value === UserType.Beneficiary )

//const user: UserType = UserType.None;

const afterEnter = () => {
    setTimeout(() => {
        bgClass.value = "bg-black fade";
        buttonClass.value = 'btn-primary';
    }, 1000)
}

const user = computed(() => {
    if(grantorTrusts.value > 0)
        return UserType.Grantor;
    else if (beneficiaryTrusts.value > 0)
        return UserType.Beneficiary;
    else if (trusteeTrusts.value > 0)
        return UserType.Trustee;
    else
        return UserType.None;
})

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