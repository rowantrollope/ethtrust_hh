<!--
    Input field which displays a truncated address field and has a popup 
--> 
<template>
    <span @click.stop="onClick" @mouseover="hover=true" @mouseleave="hover=false" class="cursor-pointer">
            <transition name="pop" mode="out-in">
                <span v-if="displayPopup" class="tooltip">
                    Copied!
                </span>
            </transition>
        <span class="field">{{ shortenAddress(address) }}
            <transition name="slide" mode="in-out">
            <svg v-if="hover" xmlns="http://www.w3.org/2000/svg" class="inline -mt-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            </transition>
            <!--
            <svg xmlns="http://www.w3.org/2000/svg" class="inline h-4 w-4 -mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg> -->
        </span>
    </span>
</template>

<script setup="props, { emit, slots }" lang="ts">
import { ref } from 'vue';
import { shortenAddress } from '../services/Helpers'

const displayPopup = ref(false);
const hover = ref(false);
const props = defineProps({
    address: { type: String, required: true},
});

const onClick = () => {
    navigator.clipboard.writeText(props.address);
    displayPopup.value = true;
    setTimeout(()=> displayPopup.value = false, 2000);
}
</script>

<style scoped>
.field {
    @apply 
    hover:text-blue-500  
    border-gray-300 
    hover:border-blue-400 
    relative 
    border-b 
    p-0.5;
}
.tooltip {
    @apply
    absolute 
    transform 
    z-50 
    p-1 
    text-gray-800 
    rounded-md 
    bg-white 
    border 
    shadow-lg;
    --tw-translate-x:-63%;
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
    transition: ease-out 0.5s;
}
.pop-leave-to {
    opacity:0%;
    transition: ease-out 0.5s;
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