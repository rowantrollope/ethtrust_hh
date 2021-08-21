<!--
    Card display for a single trust, shown by the ForYou list.
--> 
<template>
    <div :class="selectable ? 'card-selectable' : ''" 
         class="card justify-center cursor-pointer" 
         @click="emit('click')">
        <div class="card-inner">
            <img alt="cert" width="400" src="../assets/money.png">
            <div class="cert-name">{{ trust.name }}</div>            
            <div class="cert-eth">{{ formatEtherString(trust.etherAmount) }}</div>
            <div class="cert-date">Available: {{ trust.getMaturityDate().toLocaleDateString() }}</div>              
            <div class="cert-creator text-xs">{{ shortenAddress(trust.grantor) }}3</div>            
            <div class="cert-trustee text-xs">
                <span v-for="trustee in trust.trustees">{{ shortenAddress(trustee) }}, </span></div>            
        </div>
    </div>
</template>

<script setup="props, {emit}" lang="ts">
import { Trust } from '../services/Trust';
import { formatEtherString, shortenAddress, toDate } from '../services/Helpers';

const props = defineProps({
    trust: { type: Trust, required: true },
    selectable: Boolean,
});

const emit = defineEmits(['click']);

</script>

<style scoped>
     .card {
        @apply relative 
        py-0 
        flex 
        items-center 
        text-center
        bg-white 
    }
    .card-selectable {
        @apply border
        rounded-md
        border-gray-300
        bg-gray-100
        shadow-sm
        hover:border-black
        focus-within:ring-2 
        focus-within:ring-offset-4 
        focus-within:ring-green-800;
    }
     .card-inner {
        @apply relative 
        flex 
        py-2
        px-2
    }
    .cert-name {
            position: absolute;
            top: 35%;
            left: 50%;
            transform: translate(-50%, -50%);
            @apply text-2xl font-serif leading-tight uppercase;
    }
    .cert-eth {
            position: absolute;
            top: 69%;
            left: 50%;
            transform: translate(-50%, -50%);
            @apply text-3xl text-white font-bold;
    }
    .cert-creator {
            position: absolute;
            top: 75%;
            left: 23%;
            transform: translate(-50%, -50%);
    }
    .cert-trustee {
            position: absolute;
            top: 75%;
            left: 77%;
            transform: translate(-50%, -50%);
    }
    .cert-date {
            position: absolute;
            top: 48%;
            left: 50%;
            transform: translate(-50%, -50%);
            @apply font-serif text-xl ;
    }

</style>
