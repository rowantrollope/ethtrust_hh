<!--
    About the Trusted app, FAQ, etc
-->
<template>
<div>
    <PageTitle>
        <template v-slot:title>Frequently Asked Questions</template>
    </PageTitle>
    <div class="relative mt-5 sm:mt-10 ml-5 mr-2 sm:ml-10 overflow-hidden">
        <div class="max-w-7xl mx-auto">
            <div class="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">

                <h1 class="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                <span class="block xl:inline">Frequently Asked </span>
                <span class=" text-teal-400 inline">Questions</span>
                </h1>

                <div class=" mt-5 sm:ml-10 sm:mt-10 text-left flex flex-col space-y-5">
                    <p class="question">What is Safetrust.io?</p>
                    <p class="answer">Safetrust.io provides an easy and secure way to easily pass Crypto assets to your family and children.  Safetrust.io uses the concept of a trust fund to hold your crypto and provide easy access by your beneficiaries and trustees.</p>

                    <p class="question">How much does it cost to setup a Safetrust.io trust fund?</p>
                    <p class="answer ">
                        Nothing! Setting up a trust fund using Safetrust.io for your children or friends or family is completely free.
                    </p>

                    <p class="question">Does my trust fund gain in value over time? </p>
                    <p class="answer ">
                        Not yet. Right now your assets (ETH only supported today) sits safely in a smartcontract but cannot be invested.
                    </p>

                    <p class="question">How do I setup a wallet for my beneficiaries</p>
                    <p class="answer ">Use an app like Metamask or Rainbox to create a new wallet for your beneficiaries (and trustees).  Give the kids the seed phrase. </p>

                    <p class="question">How is a Safetrust.io trust better than a normal trust fund?</p>
                    <p class="answer">
                        Your crypto is difficult to transfer via a normal trust fund.  Assuming you own your own keys, you need to have a mechanism to pass those keys onto 
                        your children or beneficiaries.  There is no easy way to prevent access to those keys, or it requires handing them to a trustee who will have complete access.
                        Safetrust.io is completely decentralized and does not require any third parties.  Safetrust.io sets up a smartcontract to hold your eth.  You can define the beneficiary and trustees who can access the funds and set rules like a maturity date.
                        Your money is completely secured by the blockchain.  Its the safest, fastest, most economical way to transfer money to others.
                    </p>

                    <p class="question">What is a Beneficiary and a Trustee?</p>
                    <p class="answer ">The Beneficiary is the person who will receive the ETH in the trust after the Maturity date has passed. 
                        The Trustee is a trusted person who can access the trust on behalf of the beneficiary.
                    </p>


                    <p class="question">Do I need a Trustee?</p>
                    <p class="answer ">Not required but highly recommended.  The Trustee is simply an additional person who has access to the ETH in the trust. <br/><br/>
                        Note that the trustee cannot access the ETH until after the maturity date.  
                    </p>

                    <p class="question">Can I assign a new owner to the trust? </p>
                    <p class="answer ">A new beneficiary or new trustee may be assigned, but only by the grantor (Creator) of the trust.</p>

                    <p class="question">What is a seed phrase</p>
                    <p class="answer ">A seed phrase is a 12 word password for your wallet</p>

                    <p class="question">Can I add money after I've created a trust?</p>
                    <p class="answer ">Yes.  You can deposit more ETH into a trust at any time.</p>

                    <p class="question">Who can withdraw funds from a trust?</p>
                    <p class="answer ">Only a beneficiary or trustee can withdraw funds, and only after the maturity date.</p>

                    <p class="question">What if I change my mind and want to cancel the trust?</p>
                    <p class="answer ">An irrevocable trust cannot be changed once created.  A revocable trust can be changed and deleted.  You must first withdraw all funds from a revocable trust before deleting it.</p>

                    <p class="question">Other questions? Contact us here!</p>
                    <p class="answer ">Send me an email for help: trolloperowan@gmail.com</p>

                    <p class="question">What types of trusts are supported today?</p>
                    <p class="answer ">Today only revocable and irrevocable trusts are supported.  Others trust types are coming soon.</p>

                    <p class="question">Are Safetrust.io trusts legal in all states?</p>
                    <p class="answer ">Check with your estate planning professional.  An irrevocable trust is fairly straightforward and we believe Safetrust.io follows the basic rules of simple date based irrevocable trusts. </p>

                    <p class="question">Where can I learn more about trusts?</p>
                    <p class="answer "><a class="underline text-blue-500" href="https://www.investopedia.com/terms/t/trust-fund.asp">Click here</a> for a handy guide on Investopedia.</p>

                    <p class="question">Is Safetrust.io opensource?</p>
                    <p class="answer ">Yes! Safetrust.io smartcontract is open source, available here: </p>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script setup lang="ts">
import PageTitle from '../components/PageTitle.vue';

</script>

<style scoped>
.question {
    @apply font-bold text-2xl;
}
.answer {
    @apply text-xl sm:ml-10 dark:text-gray-400;
}
</style>
