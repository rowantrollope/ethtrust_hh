<!--
    Page title used - generic component.  Supports a title and buttons area
--> 
<template>
<div class="sticky pb-2 flex items-center dark:bg-slate-800 dark:bg-opacity-80 top-0 backdrop-filter shadow-sm backdrop-blur-md bg-opacity-60 z-30 px-2 pt-2 border-b border-gray-300 dark:border-gray-600">
    <h2 class="grow text-xl text-left font-sans font-light">
        <slot name="title"></slot>
    </h2>
    <slot name="buttons"></slot>
</div>
</template>

<script setup lang="ts">
</script>

<style>
</style>
