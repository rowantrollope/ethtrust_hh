<!--
    Dialog used to edit a trust settings.

    Handles edit of editable settings, deposit, withdraw, delete.  All actions taken through caller
    upon emitted events.

    Caller passes in a temporary trust object which can be discarded on Cancel/Close

--> 
<template>
    <Modal @cancel="onCancel">
        <template v-slot:title>
            <slot class="" name="title"></slot>
        </template>

        <div class="col-span-12 text-base border-gray-500 rounded-md sm:p-2">            
            <span class="mt-1 inline text-gray-500">
                Balance: 
                </span>
                <span class="inline -ml-2 text-green-500 text-base items-center">
                <svg class="inline" xmlns="http://www.w3.org/2000/svg" height="24" width="24" preserveAspectRatio="xMidYMid" viewBox="-38.39985 -104.22675 332.7987 625.3605"><path fill="#343434" d="M125.166 285.168l2.795 2.79 127.962-75.638L127.961 0l-2.795 9.5z"/><path fill="#8C8C8C" d="M127.962 287.959V0L0 212.32z"/><path fill="#3C3C3B" d="M126.386 412.306l1.575 4.6L256 236.587l-128.038 75.6-1.575 1.92z"/><path fill="#8C8C8C" d="M0 236.585l127.962 180.32v-104.72z"/><path fill="#141414" d="M127.961 154.159v133.799l127.96-75.637z"/><path fill="#393939" d="M127.96 154.159L0 212.32l127.96 75.637z"/></svg>
                </span>
                <span class="inline text-green-500"> {{ toEtherStringRounded(trust.etherAmount) }} ETH </span>
            
            <p class="mt-1 text-gray-500"> Trust Number: 
                <span class="text-gray-900"> <AddressField :address="trust.key"/> </span>
            </p>
            <p class="mt-1 text-gray-500"> Created by (Grantor): 
                <span class="text-gray-900">
                    <AddressField :address="trust.grantor"></AddressField>
                </span>
            </p>
            <p class="mt-1 text-gray-500"> Trust Type: 
                <span class="text-gray-900"> {{ trust.getTypeString() }} </span> 
            </p>
            <p class="mt-1 text-gray-500">Revokable? 
                <span class="text-gray-900">{{ revokable ? "YES" : "NO" }} </span>
            </p>

        </div>
        
        <div class="mt-5 sm:hidden">
            <label for="tabs" class="sr-only">Select a tab</label>
            <select id="tabs" name="tabs" v-model="activeTab" class="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md hover:border-indigo-500">
                <option v-for="(tab, index) in tabs" :value="index" :key="index">{{ tab.name }}</option>
            </select>
        </div>
        <div class="mt-5 hidden sm:block">
            <nav class="flex space-x-2" aria-label="Tabs">
                <a v-for="(tab, index) in tabs" 
                    :key="index" 
                    :class="[activeTab===index ? 'selected-tab' : 'unselected-tab', 'tab']" 
                    :aria-current="activeTab===index ? 'page' : undefined"
                    @click="activeTab = index">
                {{ tab.name }}
                </a>
            </nav>
        </div>
        

        <div class="tab-content">
            <p class="tab-title">{{tabs[activeTab].title}}</p> <br/>

            <!--
                Tab: Details
            -->
            <div v-show="activeTab===0">
                <p class="text-sm ml-5">Note: Funds will not be accessible until AFTER the maturity date.</p>
                <div class="mt-5 grid grid-cols-12 gap-2 sm:gap-6">
                    <div class="col-span-12 sm:col-span-4 sm:justify-self-end sm:pt-2">
                        <label for="trust_name" class="label-text">Trust name</label>
                    </div>
                    <div class="col-span-12 sm:col-span-8">
                        <input type="text" v-model="trust.name" name="trust_name" id="trust_name" autocomplete="trust-name" class="input-field" />
                    </div>
                    <div class="col-span-12 sm:col-span-4 sm:justify-self-end sm:pt-2 ">
                        <label for="maturity_date" class="label-text">Maturity Date</label>
                    </div>
                    <div class="col-span-12 sm:col-span-8">     
                        <div class="mt-2" v-if="!revokable">
                            {{ trust.getMaturityDate().toLocaleDateString() }} 
                            <span class="text-gray-500 text-sm">(Can't change maturity date on IRREVOKABLE trust)</span>
                        </div>
                        <div v-else>
                            <DatePicker v-model="maturityDate" mode="date" class="flex-grow">
                                <template v-slot="{ inputValue, inputEvents }">
                                    <input class="input-field" :value="inputValue" v-on="inputEvents"/>
                                </template>
                            </DatePicker>
                        </div>
                    </div>
                </div>
            </div>
            <!--
                TAB: Beneficiary
            -->
            <div v-show="activeTab===1">
                <div v-if="revokable">
                <p class="text-sm mb-5 ml-5">Note: The beneficiary is who will receive this ETH after the maturity date. Trustees can also access funds.</p>
                <InputBeneficiary v-model="trust"
                    @valid="validEntry = true" 
                    @invalid="validEntry = false"></InputBeneficiary>
                </div>
                <div v-else>
                    <p class="text-sm mb-5 ml-5">Note: This trust type is IRREVOKABLE and you cannot edit or change the BENEFICIARY.  The beneficiary will receive this ETH after the maturity date. Trustees can also access funds.</p>
                    <p class="text-center">{{ trust.beneficiary }}</p>
                </div>
            </div>      
            <!-- 
                TAB: Trustees
            -->
            <div v-show="activeTab===2">                    
                <div v-if="revokable">
                    <p class="text-sm mb-5 ml-5">Note: Each trustee will have full access to transfer or manage the funds in this trust.</p>
                    <InputTrustees v-model="trust"></InputTrustees>
                </div>
                <div v-else>
                    <p class="text-sm mb-5 ml-5">Note: This trust type is IRREVOKABLE and you cannot edit or change the TRUSTEES.</p>
                    <div class="text-lg"><u>Trustees</u>
                        <div v-for="trustee in trust.trustees" class="text-center" :key="trustee"><p>{{ trustee }}</p></div>
                    </div>
                </div>
            </div>      
            <!--
                TAB: Withdraw 
            -->
            <div v-show="activeTab===3">
                <div v-if="!canWithdraw" class="space-y-3 mb-5 text-base">
                    <p>You may not withdraw from this fund:</p>
                    <p class="text-center">{{ reason }}</p>
                </div>
                <div v-else>
                    <p class="sm:ml-5 text-sm"> Note: Funds will be returned to the owner of the trust.  Only the trust fund owner or a trustee may withdraw. 
                        Maximum withdrawal: 
                        <span class="text-green-500">{{ toEtherStringRounded(trust.etherAmount) }} ETH</span>
                    </p><br/>
                    
                    <div class="sm:flex text-center sm:justify-center items-center">
                        <EthInput v-model="ethWithdraw">Amount to withdraw</EthInput>
                        <Button class="sm:flex sm:ml-5 btn-success" :onClick="onWithdraw">Withdraw Now</Button>
                    </div>
                </div>
            </div>
            <!--
                TAB: Deposit
            -->
            <div v-show="activeTab===4">
                <p class="text-sm ml-5">Note: Only ETH deposits are supported at this time.
                    Your Wallet Balance: 
                    <span class="font-bold text-green-600"> {{ walletBalance }} ETH </span>
                </p><br/>

                <div class="flex justify-center items-center">

                    <EthInput v-model="ethDeposit">Deposit Amount</EthInput>

                    <Button class="ml-5 btn-success" :onClick="onDeposit">
                        Deposit Now
                    </Button>
                </div>
            </div>

            <!--
                TAB: Delete
            -->
            <div v-show="activeTab===5">
                <div v-if="!revokable" class="ml-5">
                    <p>This trust is IRREVOKABLE and cannot be deleted.</p>
                </div>
                <div v-else-if="!canWithdraw"
                    class="mb-5 space-y-2 text-base">
                    <p>You cannot delete this trust fund..</p>    
                    <p>{{ reason }}</p>                    
                </div>
                <div v-else-if="trust.etherAmount > BigNumber.from(0)">
                    <p>You cannot delete this trust fund, as the balance is not 0. Please withdraw the funds then delete.</p>
                </div>
                <div v-else>
                    <p class="text-sm ml-5">
                        Note: The balance on this trust fund is 0 and it can be deleted.
                    </p>
                    <div class="mt-5 text-center">
                        <Button class="btn-danger" :onClick="onDelete" >
                        Delete Trust Now
                        </Button>
                    </div>
                </div>
            </div> 
            <!--
                Tab: Type
            -->
            <div v-show="activeTab===6" >
                <p class="text-sm ml-10 mb-5">Note: You cannot change the trust type once it is created.</p>
                <InputTrustType class="ml-10" v-model='trust'></InputTrustType>
            </div>

        </div>

        <div class="flex flex-col sm:flex-row mt-5">
            <Button class="flex-1 btn-white" :onClick="onCancel" >
                Cancel
            </Button>
            <Button class="mt-2 sm:mt-0 sm:ml-2 flex-1 " 
                    :class="[validEntry ? 'btn-primary': 'btn-disabled']"
                    :onClick="onSave"
                    :disabled="!validEntry">
                Save Changes
            </Button>                                                    
        </div>                               
    </Modal>
</template>

<script setup="props, {emit}" lang="ts">
import { ref, inject, computed, onMounted } from 'vue'
import { BigNumber } from "@ethersproject/bignumber";
import { DatePicker } from 'v-calendar';

// services
import BlockchainConnect from '../services/BlockchainConnect';
import CurrencyExchange from '../services/CurrencyExchange';
import { Trust, TrustType } from '../services/Trust'
import { toEtherStringRounded, shortenAddress } from '../services/Helpers';

// components
import Modal from './Modal.vue';
import Button from './Button.vue';
import EthInput from './InputEther.vue';
import InputBeneficiary from './InputBeneficiary.vue';
import InputTrustees from './InputTrustees.vue';
import InputTrustType from './InputTrustType.vue';
import AddressField from './AddressField.vue';

const props = defineProps({
    modelValue: { type: Trust, required: true },
    reason: String,
    canWithdraw: Boolean,
});

const activeTab = ref(0);
const tabs = ref([
    { name: "Details", title: "Edit Trust Details" },
    { name: "Beneficiary", title: "Set Trust Beneficiary" },
    { name: "Trustees", title: "Set Trustees" },
    { name: "Withdraw", title: "Withdraw Funds" },
    { name: "Deposit", title: "Deposit Funds" },
    { name: "Delete", title: "Delete this Trust Fund" },
    { name: "Type", title: "Select Trust Type" }]
);

const emit = defineEmits(['update:modelValue', 'save', 'cancel', 'delete', 'withdraw', 'deposit', 'invest']);

const exchange: CurrencyExchange | undefined = inject('exchange');
let bc: BlockchainConnect | undefined = inject('BlockchainConnect');

const validEntry = ref(true);

// Variables

const trust = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});
const revokable = computed(() => trust.value.trustType === TrustType.REVOKABLE);

const maturityDate = computed({
    get: () => trust.value.getMaturityDate(),
    set: (value) => trust.value.setMaturityDate(value),
})

const ethWithdraw = ref(0);
const ethDeposit = ref(0);
const walletBalance = ref("0");

const mounted = onMounted(() => {
    bc?.getBalanceString(4).then(val => 
        walletBalance.value = val 
    );
});


// Methods
const onSave = () => emit('save');
const onCancel = () => emit('cancel');
const onDelete = () => emit('delete');
const onWithdraw = () => emit('withdraw', ethWithdraw.value);
const onDeposit = () => emit('deposit', ethDeposit.value);

</script>

<style scoped>

.tab {
    @apply px-3 py-2 sm:font-medium text-lg ;
}
.tab-content {
    @apply border-gray-300 text-base border mt-2 rounded-md p-2 sm:p-5;
}
.tab-title {
    @apply text-lg
}
.selected-tab {
    @apply cursor-pointer text-white bg-gray-500 rounded-md border-gray-300;
}
.unselected-tab {
    @apply cursor-pointer border border-white text-gray-700 rounded-md hover:border-gray-500;
}
.input-field {
    @apply  text-base text-black p-2 block border focus:ring-indigo-500 focus:border-indigo-500 w-full min-w-0 rounded-md border-gray-300;
}
.input-field-invalid {
    @apply  text-base text-red-500 p-2 block border focus:ring-red-500 focus:border-red-500 w-full min-w-0 rounded-md border-red-500;
}
.label-text {
    @apply block text-left text-base sm:font-medium text-gray-700;
}
</style> 
