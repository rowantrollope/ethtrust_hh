<!--
    Input field which displays a truncated address field and has a popup 
--> 
<template>
    <span @click.stop="displayPopup=!displayPopup" @mouseleave="displayPopup=false">
        <span class="field">{{ shortenAddress(address) }}
            <transition name="pop" mode="out-in">
                <span v-if="displayPopup" class="tooltip">
                    {{ address }}
                </span>
            </transition>
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
    /* transform: scale(.6);*/
    transition: ease-in-out 0.2s;
}
.pop-enter-to {
    opacity: 100%;
    /* transform: scale(1); */
    transition: ease-in .2s
}
.pop-leave-from {
    opacity:100%;
    transform: scale(1);
    transition: ease-out 0.5s;
}
.pop-leave-to {
    opacity:0%;
    transform: scale(0);
    transition: ease-out 0.5s;
}

</style>