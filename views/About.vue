<!--
    About the Trusted app, FAQ, etc
-->
<template>
    <div class="relative bg-white mt-10 ml-10 overflow-hidden">
        <div class="max-w-7xl mx-auto">
            <div class="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">

                <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span class="block xl:inline">Frequently Asked </span>
                <span class=" text-indigo-600 inline">Questions</span>
                </h1>

                <div class="ml-10 mt-10 text-left flex flex-col space-y-5">
                    <p class="question">What can I use Trusted.eth For?</p>
                    <p class="answer">Trusted.eth provides an easy and secure way to pass on money (ETH) to your friends, family and children.  Set a maturity date and when that date elapses, your beneficiary can withdraw their funds</p>

                    <p class="question">How much does it cost to setup a trust fund?</p>
                    <p class="answer ">
                        Nothing! Setting up a trust fund for your children or friends or family is completely free.
                    </p>

                    <p class="question">Does my trust fund gain in value over time? </p>
                    <p class="answer ">
                        Yes! Trusted.eth invests your ETH and passes on the returns to you, minus 10% of the gains.
                    </p>

                    <p class="question">How do I setup a wallet for my beneficiaries</p>
                    <p class="answer ">That's a great question, go setup a new account using metamask.  Give the kids the seed phrase. </p>

                    <p class="question">What is better about trusted.eth vs a normal trust fund?</p>
                    <p class="answer">
                        Creating a trust fund through the normal channels involves lawyers and banks.  Trusted.eth is completely decentralized and does not require any third party.
                        Your money is completely secured by the blockchain.  Its the safest, fastest, most economical way to transfer money to others.
                    </p>

                    <p class="question">What is a Beneficiary and a Trustee?</p>
                    <p class="answer ">The Beneficiary is the person who will receive the ETH in the trust after the Maturity date has passed. 
                        The Trustee is a trusted person who can access the trust on behalf of the beneficiary.
                    </p>


                    <p class="question">Do I need a Trustee?</p>
                    <p class="answer ">No.  Having a Trustee is completely optional.  It is recommended in the case where the beneficiary may receive the trust before they are able to manage it
                        and can be useful in case they lose their passphrase.  The Trustee is simply an additional person who has access to the ETH in the trust. <br/><br/>
                        Note that the trustee cannot access the ETH until after the maturity date.  Before then the contents of the trust are only accessible by the creator.
                    </p>

                    <p class="question">Can I assign a new owner to the trust? </p>
                    <p class="answer ">A new beneficiary or new trustee may be assigned, but only by the creator of the trust.</p>

                    <p class="question">What is a seed phrase</p>
                    <p class="answer ">Answer goes here</p>

                    <p class="question">Can I add money after the fact?</p>
                    <p class="answer ">Answer goes here</p>

                    <p class="question">Who can withdraw funds</p>
                    <p class="answer ">Answer goes here</p>

                    <p class="question">What if I change my mind?</p>
                    <p class="answer ">Answer goes here</p>

                    <p class="question">Other questions? Contact us here!</p>
                    <p class="answer ">Answer goes here</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.question {
    @apply font-bold text-2xl;
}
.answer {
    @apply text-xl ml-5;
}
</style>
