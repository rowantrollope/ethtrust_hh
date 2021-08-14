<!--
    The primary view of trusts "for you" (this is designed for the beneficiaries )
-->
<template>
    <div v-if="bc.state.isConnected && ts.state.isConnected">
        <PageTitle>
            <template v-slot:title>Trusts Created for You</template>
        </PageTitle>

        <div class="relative w-full h-36 overflow-hidden ">
            <div class="absolute filter blur inset-0 bg-cover bg-center z-0" style="background-image: url('https://images.unsplash.com/photo-1476703993599-0035a21b17a9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmFtaWx5JTIwa2lkc3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=60')"></div>
            <div class="absolute inset-0 ml-5 opacity-100 hover:opacity-100 duration-300 z-10 mt-10 items-center text-2xl text-white font-light">
                Your Ethereum account # is: 
            </div>
            <div @mouseover="hover=true" @mouseleave="hover=false" >
            <transition mode="out-in" name="grow" >   
                <div v-if="hover" class="absolute inset-0 mt-20 ml-10 z-20 text-2xl text-white overflow-hidden font-light">
                    {{ bc.state.mainAccount }}
                </div>
            </transition>
            <transition mode="out-in" name="fade">
                <div v-if="!hover" class="absolute inset-0 mt-20 ml-10 z-10 text-gray-300 whitespace-nowrap text-2xl text-white overflow-hidden font-light">
                    {{ $filters.shortenAddress(bc.state.mainAccount) }}
                </div>
            </transition>
            </div>
        </div>       
        <div class="mt-5 px-5">
            <ForYouList/>
        </div>
    </div>
    <!-- 
        When empty, display some helpful text
    --> 
    <ConnectBlock/>

</template>

<script setup>
import { ref } from 'vue';

import PageTitle from '@/components/PageTitle';
import ForYouList from '@/components/ForYouList';
import ConnectBlock from '@/components/ConnectBlock';

import bc from '@/services/Blockchain';
import ts from '@/services/TrustContract';

const hover = ref('false');

const onItemsLoaded = (num) => {
    //displayHelpText.value = num === 0;
}

</script>

<style scoped>
    .fade-enter-active {
        transition: opacity 2000ms ease-in-out;
    }
    .fade-enter-from {
        opacity: 0;
    }
    .fade-enter-to {
        opacity: 100;
    }
    .fade-leave-active {
        transition: opacity 200ms ease-in-out;
    }
    .fade-leave-from {
        opacity: 100;
    }
    .fade-leave-to {
        opacity: 0;
    }

    .grow-enter-active {
        transition:width 500ms ease-in-out;
    }
    .grow-enter-from {
        width: 0%;
    }
    .grow-enter-to {
        width:100%;
    }
    .grow-leave-active {
        transition:width 2000ms ease-in-out;    
    }
    .grow-leave-from {
        width: 100%;
    }
    .grow-leave-to {
        width: 0%;
    }


</style>