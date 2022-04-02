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
});
const emit = defineEmits(['click']);

const bgClass = ref("bg-blue-500");
const buttonClass = ref("btn-slate-900");

const afterEnter = () => {
    setTimeout(() => {
        bgClass.value = "bg-slate-900 fade";
        buttonClass.value = 'btn-success';
    }, 1000)
}

</script>

<style scoped>

@keyframes bgFade {
  from {background-color: rgba(59, 130, 246);}
  to {background-color: rgba(15, 23, 42);}
}
.fade {
    animation-name: bgFade;
    animation-duration: 3s;
    animation-delay: 0s;
}
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