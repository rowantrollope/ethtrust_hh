<template>

<PageTitle >
    <template v-slot:title>Guides</template>
</PageTitle>
<div class="relative py-16 bg-white overflow-hidden">
    <div class="relative px-4 sm:px-6 lg:px-8">
        <div class="text-lg max-w-prose mx-auto">
            <h1>
            <span class="block text-base text-center text-indigo-600 font-semibold tracking-wide uppercase">
                Introducing
            </span>
            <span class="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Trust Funds for Crypto
            </span>
            </h1>
            <p class="mt-8 text-xl text-gray-500 leading-8">
                This guide is designed to help you up and running in creating a trust fund to contain 
                your crypto.  SafeTrust.io uses a SmartContract to store your cryptocurrency and ensure 
                that you fully control who has access <strong> and at what time </strong>.
            </p>
        </div>
        <div class="mt-6 prose prose-indigo prose-lg text-gray-500 mx-auto">
            <p>A little more about how this process works <a href="#">Learn more about Smartcontracts</a> </p>
            <ul role="list">
                <li>Safetrust.io Smartcontract has been audited by top US trust fund attorneys.</li>
                <li>Safetrust.io Smartcontract has been audited by top security experts.</li>
                <li>This is the best way.</li>
            </ul>
            <p>Here I'll put some more informations about all of this stuff.</p>
            <h2>For Grantors</h2>
            <p>This section will help you learn about creating a trust fund.</p>
            <blockquote>
                <p>SafeTrust was the fastest and easiest way without compromising security, to ensure my crypto could be handed on to my children.</p>
            </blockquote>
            <p>Yes that's a real expert folks</p>
            <figure>
                <img class="w-full rounded-lg" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&w=1310&h=873&q=80&facepad=3" alt="" width="1310" height="873" />
                <figcaption>This guy trusts it</figcaption>
            </figure>
            <h2>Everything you need to get up and running</h2>
            <p>Some more information for you </p>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import PageTitle from '../components/PageTitle.vue';
</script>
