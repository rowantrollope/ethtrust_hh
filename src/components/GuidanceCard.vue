<template>
    <div class="flex justify-center">

        <div class="flex-col space-y-4 dark:bg-slate-700 bg-white justify-center text-center p-4 rounded-xl  shadow-sm
                    hover:shadow-lg hover:scale-[1.01] transition-all duration-400 transform ease-in-out relative">
            <h1 class="font-bold mt-5 mb-5 text-2xl">
                {{title}}
            </h1>
            <slot name="body"></slot>
            <slot name="buttons"></slot>
            <slot name="image"></slot>
        </div>

    </div>
</template>

<script setup="props" lang="ts">

const props = defineProps({
    title: { type: String, required: true },
    body: { type: String, required: true },
});

</script>
