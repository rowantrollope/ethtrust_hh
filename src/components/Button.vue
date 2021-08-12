<template>
    <button class="btn" type="button">
        <slot>Button</slot>
    </button>
</template>
  
<script setup lang="ts">
</script>

<style scoped>
   .btn {
        @apply inline-flex justify-center items-center px-4 py-2 tracking-wide transition-colors duration-200 transform rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2;
    }
    .btn-rounded {
        @apply rounded-3xl;
    }
    .btn-black{
        @apply text-white bg-black hover:bg-gray-500;
    }
    .btn-primary {
        @apply text-white bg-blue-500 hover:bg-blue-400 focus:ring-blue-400 ;
    }
    .btn-primary-outline {
        @apply text-blue-500 border border-blue-500 hover:bg-blue-400 focus:ring-blue-500 hover:text-white;
    }
    .btn-white {
        @apply text-black border border-gray-300 hover:bg-gray-100 focus:ring-gray-400 ;
    }
    .btn-danger {
        @apply text-white bg-red-600 hover:bg-red-500 focus:ring-red-500;
    }
    .btn-danger-outline {
        @apply text-red-500 border hover:bg-red-100 border-red-500 focus:ring-red-500;
    }
    .btn-info {
        @apply text-white bg-purple-600 hover:bg-purple-500 focus:ring-purple-500;
    }
    .btn-success {
        @apply text-white bg-green-600 hover:bg-green-500 focus:ring-green-500;
    }
    .btn-gray {
        @apply text-white bg-gray-700 hover:bg-gray-600 focus:ring-gray-600;
    }
    .btn-gray-outline {
        @apply text-black hover:text-white hover:bg-gray-600 focus:ring-gray-600;
    }
    .btn-warning {
        @apply text-black bg-yellow-300 hover:bg-yellow-200 focus:ring-yellow-200;
    }
    .btn-disabled {
        @apply text-white bg-gray-400 focus:ring-gray-600;    
    }

</style>
