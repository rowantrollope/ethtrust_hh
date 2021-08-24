<template>
    <div>
        <span>{{ grantorTrusts }} trusts as Grantor, {{ beneficiaryTrusts }} as Beneficiary, {{ trusteeTrusts }} as Trustee </span>
        <div v-if="beneficiaryTrusts">
            We found {{ beneficiaryTrusts }} for your account!
            <button class="btn btn-primary">Go to my trust</button>
        </div>
        <div v-if="trusteeTrusts">
            We found {{ trusteeTrusts }} for you as a trustee!
            <button class="btn btn-primary">Go to my trust</button>
        </div>
        <div v-if="grantorTrusts">
            We found {{ grantorTrusts }} created by you!
            <button class="btn btn-primary">Go to my trust</button>
        </div>
    </div>

</template>

<script setup lang="ts">

import { inject, ref, onMounted } from 'vue';
import TrustList from '../services/TrustList';
import { Trust } from '../services/Trust';
import { BlockchainConnect } from '../services/BlockchainConnect';

const bc: BlockchainConnect | undefined = inject ("BlockchainConnect");
const list: TrustList | undefined = inject("TrustList");
const grantorTrusts = ref(0);
const beneficiaryTrusts = ref(0);
const trusteeTrusts = ref(0);

const mounted = onMounted(() => {

    if(list === undefined || bc == undefined) return;

    let filtered: Array<Trust> | undefined;

    // Count trusts by role
    filtered = list.trusts.value?.filter(trust => trust.grantor.toUpperCase() === bc.account.value.toUpperCase() );
    grantorTrusts.value = filtered ? filtered.length : 0;

    filtered = list.trusts.value?.filter(trust => trust.beneficiary.toUpperCase() === bc.account.value.toUpperCase() );
    beneficiaryTrusts.value = filtered ? filtered.length : 0;

    filtered = list.trusts.value?.filter(trust => 
            -1 !== trust.trustees.findIndex(trustee => 
                trustee.toUpperCase() === bc.account.value.toUpperCase()
            )
        );
    trusteeTrusts.value = filtered ? filtered.length : 0;


});

</script>