<!-- This example requires Tailwind CSS v2.0+ -->
<template>
<SwitchGroup>
    <SwitchLabel class="mr-1 cursor-pointer"> <slot></slot> </SwitchLabel>
    <Switch v-model="enabled" :class="[enabled ? colorOn : colorOff]"
        class="relative inline-flex flex-shrink-0 px-1 font-bold border-2 text-sm border-transparent animate-colors duration-500 rounded-full cursor-pointer focus:outline-none ">
        <!-- The white slider box -->
        <span v-if="true" class="left absolute animate z-10 bg-white rounded-full" :class="[enabled ? 'move' : '']">
            <!-- these are invisible, used only for sizing the box -->
            <span v-if="enabled" class="invisible whitespace-nowrap ml-1 p-1 inline-block">{{ textOn }}</span>
            <span v-else class="invisible whitespace-nowrap p-1 ml-1 mr-1 inline-block">{{ textOff }}</span>
        </span>

        <!-- Labels -->
        <span class="z-20 p-1 whitespace-nowrap" :class="[enabled ? 'text-green-50' : 'text-green-700']">{{textOff}}</span>
        <span class="z-20 p-1 px-2 ml-1 -mr-1.5 whitespace-nowrap" :class="[enabled ? 'text-green-700' : 'text-green-50']">{{textOn}}</span>
    </Switch>
</SwitchGroup>
</template>


<script setup="props, {emit}" lang="ts">
import { computed } from 'vue'

import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'

const enabled = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
    modelValue: { type: Boolean, required: true, default: false },
    colorOn: { type: String, required: false, default: "bg-green-500" },
    colorOff: { type: String, required: false, default: "bg-gray-300" },
    textOn: { type: String, required: false, default: "On" },
    textOff: { type: String, required: false, default: "Off" },
});

</script>

<style scoped>
     .animate {
        transition: all 200ms ease;
        cursor: pointer;
      }
      .animate.left {
          left: 0;
      }
      .animate.left.move {
        left: 100%; 
        transform: translate(-100%, 0);
      }

</style>