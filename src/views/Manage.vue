<!--
    The primary list of trusts "Manage Trusts" (this is designed for the creators )
-->
<template>
<div>
    <!-- 
        When empty, display some helpful text
    --> 
    <PageTitle v-if="bc.connectionState.value === state.Connected">
        <template v-slot:title>Create & Manage Trusts</template>
        <template v-slot:buttons>           
            <button class="btn btn-rounded btn-primary text-sm" :onClick="onCreateNew">
                Create New
            </button>            
        </template>
    </PageTitle>
    <div class="px-5 mt-5">
        <ManageTrusts @create-clicked="onCreateNew"></ManageTrusts>
    </div>
    <CreateWiz :show="isCreateDialogVisible" @close="onCloseCreate">Create New Trust</CreateWiz>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// components
import PageTitle from '../components/PageTitle.vue';
import ManageTrusts from '../components/ManageTrusts.vue';
import CreateWiz from '../components/CreateWiz.vue';
import ConnectBlock from '../components/ConnectBlock.vue';

// services
import { useBlockchainConnect, ConnectionState } from '../services/BlockchainConnect';

const bc = useBlockchainConnect();
const state = ConnectionState;

//
// Create Handlers
//
const isCreateDialogVisible = ref(false);

const onCreateNew = () => { isCreateDialogVisible.value = true; }
const onCloseCreate = () => { isCreateDialogVisible.value = false; };

</script>
