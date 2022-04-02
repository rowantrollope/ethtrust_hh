
<template>
<div class="relative flex justify-center text-center">
    <div class="">
        <img class="sm:w-44 sm:h-44 w-40" alt="cert" src="../assets/certificate.png">
    </div>
    <transition name="highlight" mode="out-in">
        <div class="cert-name" :key="trust.name">
            {{ trust.name }}
        </div>            
    </transition>
    <transition name="pop" mode="out-in">
        <div class="cert-eth" :key="trust.etherAmount.toString()">
            {{ utils.formatEtherString(trust.etherAmount) }}
        </div>    
    </transition>
</div>
</template>

<script setup="props, {emit}" lang="ts">

// services
import Trust from '../services/Trust';
import { useTrustList } from '../services/TrustList';
import * as utils from '../services/Utils';

const props = defineProps({
    trust: { type: Trust, required: true },
});

const list = useTrustList();

</script>

<style scoped>
    .cert-name {
        position: absolute;
        top: 42%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 0.6rem;
        @apply font-serif font-thin leading-tight uppercase;
    }
    .cert-eth {
            position: absolute;
            top: 61%;
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