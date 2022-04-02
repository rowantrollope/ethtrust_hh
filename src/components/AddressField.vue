<!--
    Input field which displays a truncated address field and has a popup 
--> 
<template>
<span @mouseover="hover=true" @mouseleave="hover=false" class="cursor-pointer">

    <span class="relative underline decoration-blue-500 p-0.5 border-gray-300">
        {{ utils.shortenAddress(address) }}
    </span>
    
        <transition name="pop" mode="out-in">
            <span v-if="viewTip" class="tooltip">
                {{tooltipText}}
            </span>
        </transition>
        <UserCircleIcon v-if="!hover && isActiveAccount" class="h-4 w-4 -mt-1 text-blue-500 inline" />
        <span v-else-if="hover">
            <svg
                @mouseover="tooltip('copy address')" @mouseleave="tooltip()"
                @click.stop="onCopy" xmlns="http://www.w3.org/2000/svg" class="inline text-blue-500 -mt-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            <svg v-if="etherscan" 
                @mouseover="tooltip('Open on EtherScan')" @mouseleave="tooltip()"
                @click.stop="onLink" xmlns="http://www.w3.org/2000/svg" class="inline text-blue-500 -mt-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>  
        </span>
        <span v-if="hover && isActiveAccount" class="text-xs ml-1 text-blue-500"></span>
</span>
</template>

<script setup="props, { emit, slots }" lang="ts">
import { ref, computed } from 'vue';
import { UserCircleIcon } from '@heroicons/vue/solid';

// services
import * as utils from '../services/Utils';
import { useBlockchainConnect } from '../services/BlockchainConnect';

const hover = ref(false);
const bc = useBlockchainConnect();

const props = defineProps({
    address: { type: String, required: true},
    etherscan: { type: Boolean, required: false, default: true },
});
const isActiveAccount = computed(() => props.address.toUpperCase() === bc.account.value.toUpperCase() );

const onCopy = () => {
    navigator.clipboard.writeText(props.address);
    tooltip("Copied!", 1000);
}
const onLink = () => {
    window.open("https://etherscan.io/address/" + props.address);
    setTimeout(()=> viewTip.value = false, 1000);
}
const viewTip = ref(false);

const tooltipText = ref('');

const tooltip = (text: string = "", timeout: number = 0) => {
    tooltipText.value = text;
    viewTip.value = text.length ? true : false;
    if(timeout) setTimeout(() => viewTip.value = false, timeout);
}
</script>

<style scoped>

.tooltip {
    @apply
    absolute 
    transform 
    z-50 
    p-1.5 
    rounded-md 
    text-sm
    whitespace-nowrap
    bg-black
    text-white 
    border 
    shadow-lg;
    --tw-translate-x:0%;
    --tw-translate-y:-100%;
}
.pop-enter-from {
    opacity: 0;
    transition: ease-in-out 0.2s;
}
.pop-enter-to {
    opacity: 100%;
    transition: ease-in .2s
}
.pop-leave-from {
    opacity:100%;
    transition: ease-out 0.2s;
}
.pop-leave-to {
    opacity:0%;
    transition: ease-out 0.2s;
}

.slide-enter-from {
    opacity: 0;
    transform: scalex(0);
    width: 0%;
    transition: ease-in-out 0.2s;
}
.slide-enter-to {
    opacity: 100%;
    transform: scalex(1); 
    transition: ease-in .2s
}
.slide-leave-from {
    opacity:100%;
    transform: scalex(1);
    transition: ease-out 0.5s;
}
.slide-leave-to {
    opacity:0%;
    transform: scalex(0);
    transition: ease-out 0.5s;
}
</style>