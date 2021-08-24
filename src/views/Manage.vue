<!--
    The primary list of trusts "Manage Trusts" (this is designed for the creators )
-->
<template>
    <!-- 
        When empty, display some helpful text
    --> 
        <PageTitle >
            <template v-slot:title>Create & Manage Trusts</template>
            <template v-slot:buttons>           
                <Button class="btn-rounded btn-primary text-sm" :onClick="onCreateNew">
                    Create New
                </Button>            
            </template>
        </PageTitle>
        <div class="px-5 mt-5">
            <ManageTrusts @create-clicked="onCreateNew"></ManageTrusts>
        </div>
        <CreateWiz :show="isCreateDialogVisible" @close="onCloseCreate">Create New Trust</CreateWiz>


</template>

<script setup lang="ts">
import { inject, ref } from 'vue';

import Button from '../components/Button.vue';
import PageTitle from '../components/PageTitle.vue';
import ManageTrusts from '../components/ManageTrusts.vue';
import CreateWiz from '../components/CreateWiz.vue';

import ConnectBlock from '../components/ConnectBlock.vue';
import { BlockchainConnect, ConnectionState } from '../services/BlockchainConnect';

let bc: BlockchainConnect = <BlockchainConnect> inject('BlockchainConnect');
const state = ConnectionState;

//
// Create Handlers
//
const isCreateDialogVisible = ref(false);

const onCreateNew = () => { isCreateDialogVisible.value = true; }
const onCloseCreate = () => { isCreateDialogVisible.value = false; };

</script>
