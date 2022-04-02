
<template>
<div class="relative w-fit">
    <img class="h-44" alt="cert" src="../assets/certificate.png">
    <transition name="highlight" mode="out-in">
        <div class="absolute flex items-center justify-center top-1/3 ml-[38px] mt-[6px] h-[28px] w-[100px] overflow-clip">
            <div class="text-xs uppercase font-serif font-thin leading-tight text-center text-black ">
                {{ trust.name }}
            </div>
        </div>
    </transition>
    <transition name="pop" mode="out-in">
        <div class="absolute flex items-center justify-center top-1/2 mt-[10px] w-full" :key="trust.etherAmount.toString()">
            <div class="relative text-sm font-base leading-tight text-white rounded-md bg-green-900">
            {{ utils.formatEtherString(trust.etherAmount) }}
            </div>
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