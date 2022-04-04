<template>
<transition name="slide" @after-enter="afterEnter">
    <div v-if="show">
        <div class="w-full h-auto items-center text-white p-3 font-light text-sm text-center"
        :class="bgClass">
            <slot></slot>
            <button class="hidden btn no-wrap" @click="$emit('click')"
                    :class="buttonClass">Lets Go!</button>
        </div>
    </div>
</transition>
</template>

<script setup="props, emits" lang="ts">
import { ref } from 'vue';

const props = defineProps({
    show: Boolean,
    toWhite: Boolean,
});
const emit = defineEmits(['click']);

const bgClass = ref("bg-blue-500");
const buttonClass = ref("btn-slate-900");

const afterEnter = () => {
    setTimeout(() => {
        bgClass.value = "transition-colors duration-1000 "
        if(props.toWhite)
            bgClass.value += "bg-white text-black dark:bg-slate-900 dark:text-white";
        else
            bgClass.value += "bg-slate-900 text-white"

        buttonClass.value = 'btn-success';
    }, 1000)
}

</script>

<style scoped>
.slide-enter-active, .slide-leave-active {
    @apply transition-all duration-1000 ease-in;
}
.slide-enter-from, .slide-leave-to {
   overflow: hidden;
   max-height: 0px;
   opacity: 0%;
}
.slide-enter-to, .slide-leave-from {
   max-height: 1000px;
   overflow: hidden;
   opacity: 100%;
}

</style>