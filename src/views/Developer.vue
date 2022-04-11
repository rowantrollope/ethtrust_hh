<!--
    TESTING goes here
-->
<template>
    <div>
        
        <PageTitle>
            <template v-slot:title>Developer View 
            </template>
        </PageTitle> 
        
        <ViewDeveloperList/>

    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// components
import Test from '../components/Test.vue';
import PageTitle from '../components/PageTitle.vue';
import ViewDeveloperList from '../components/ViewDeveloperList.vue';

</script>

<style scoped>

</style>

