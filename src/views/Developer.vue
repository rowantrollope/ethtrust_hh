<!--
    TESTING goes here
-->
<template>
    <div>
        
        <PageTitle>
            <template v-slot:title>Developer View 
            </template>
        </PageTitle>  
        <DeveloperList class="bg-white"/>
    </div>
</template>

<script setup lang="ts">

// components
import Test from '../components/Test.vue';
import PageTitle from '../components/PageTitle.vue';
import DeveloperList from '../components/DeveloperList.vue';

</script>

<style scoped>

</style>

