<template>
    <div class="mt-10 text-center text-6xl text-red-500 font-black">
        {{ msg }}
    </div>
</template>

<script setup="props" lang="ts">

const props = defineProps({
    msg: String,
});

</script>

<style scoped>
</style>
