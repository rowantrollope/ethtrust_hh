<!--
    TESTING goes here
-->
<template>
    <div>
        
        <PageTitle>
            <template v-slot:title>Developer View 
            </template>
        </PageTitle> 
        
        <DeveloperList/>

    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// components
import Test from '../components/Test.vue';
import PageTitle from '../components/PageTitle.vue';
import DeveloperList from '../components/DeveloperList.vue';

</script>

<style scoped>

</style>

