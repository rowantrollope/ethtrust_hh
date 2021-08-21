
<template>
    <div class="relative flex justify-center text-center">
        <img class="" alt="cert" width="150" src="../assets/money.png">
        <transition name="highlight" mode="out-in">
            <div class="cert-name" :key="trust.name">
                {{ trust.name }}
            </div>            
        </transition>
        <transition name="pop" mode="out-in">
            <div class="cert-eth" :key="trust.etherAmount.toString()">
                {{ formatEtherString(trust.etherAmount) }}
            </div>    
        </transition>
    </div>
</template>

<script setup="props, {emit}" lang="ts">

import { inject } from 'vue';

import { Trust } from '../services/Trust';
import TrustList from '../services/TrustList';

import { formatEtherString } from '../services/Helpers';

const props = defineProps({
    trust: { type: Trust, required: true },
});

const list = <TrustList> inject("TrustList");

</script>

<style scoped>
    .cert-name {
        position: absolute;
        top: 38%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 0.5rem;
        line-height: 1rem;
        @apply font-serif font-thin leading-tight uppercase;
    }
    .cert-eth {
            position: absolute;
            top: 70%;
            left: 50%;
            font-size: 0.7rem;
            line-height: 1rem;
            transform: translate(-50%, -50%);
            @apply text-white font-bold;
    }
    .cert-nbr {
            position: absolute;
            top: 96%;
            left: 50%;
            transform: translate(-50%, -50%);
    }
    .highlight-enter-from {
        @apply bg-blue-300 rounded-md;
        transition: all 5s;
    }
    .highlight-enter-to {
        @apply bg-white;
        transition: all 5s;
    }
    .pop-enter-from {
        @apply text-yellow-300;
        transform: scale(2) translate(-50%, -50%);
        transition: ease-out 0.8s;
    }
    .pop-enter-to {
        @apply text-white;
        transform: scale(1) translate(-50%, -50%);
        transition: ease-out 0.8s
    }
</style>