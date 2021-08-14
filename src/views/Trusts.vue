<!--
    The primary list of trusts "Manage Trusts" (this is designed for the creators )
-->
<template>
    <!-- 
        When empty, display some helpful text
    --> 
    <ConnectBlock/>
    <div v-if="bc.state.isConnected && ts.state.isConnected">
        <PageTitle >
            <template v-slot:title>Create & Manage Trusts</template>
            <template v-slot:buttons>           
                <Button class="btn-rounded btn-primary text-sm" :onClick="onCreateNew">
                    Create New
                </Button>            
            </template>
        </PageTitle>
        <div class="px-5 mt-5">
            <TrustList @create-clicked="onCreateNew"></TrustList>
        </div>
    </div>

    <CreateWiz :show="isCreateDialogVisible" @close="onCloseCreate">Create New Trust</CreateWiz>
</template>

<script setup>
import { ref } from 'vue';

import Button from '../components/Button';
import PageTitle from '../components/PageTitle';
import TrustList from '../components/TrustList';
import CreateWiz from '../components/CreateWiz';

import ConnectBlock from '../components/ConnectBlock';
import bc from '../services/Blockchain';
import ts from '../services/TrustContract';

//
// Create Handlers
//
const isCreateDialogVisible = ref(false);

const onCreateNew = () => { isCreateDialogVisible.value = true; }
const onCloseCreate = () => { isCreateDialogVisible.value = false; };

</script>
