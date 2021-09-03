<!--
    Page title used - generic component.  Supports a title and buttons area
--> 
<template>
<div class="sticky top-0 backdrop-filter shadow-sm backdrop-blur-md bg-opacity-60 z-30 px-2 pt-2 border-b border-gray-300 bg-white">
    <div class="pb-2 flex items-center">
        <h2 class="flex-auto title">
            <slot name="title"></slot>
        </h2>
        <slot class="flex-none" name="buttons"></slot>
    </div> 
</div>
</template>

<script setup lang="ts">

</script>

<style>
    .title {
        @apply text-xl text-left font-sans font-light text-black;
    }
</style>
