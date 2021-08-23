<!--
    Navigation bar 
--> 
<template>
        <div class="nav">
            <div class="flex justify-between h-12">
                <div class="flex-grow flex">
                    <div class="flex items-center md:hidden">
                        <!-- Mobile menu button -->
                        <Menu as="nav" v-slot="{ open }">
                            <MenuButton class="inline-flex items-center justify-center p-1 text-white ">
                                <span class="sr-only">Open main menu</span>
                                <Hamburger :open="open"/>
                            </MenuButton>
                            <transition name="fadeslide">
                                <MenuItems class="origin-top-left absolute -ml-2 mt-2 px-2 w-full h-full pt-5 pb-5 shadow-lg bg-black ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                    <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                                        <MenuItem>
                                            <router-link class="mobile-router-link" tag="li" to="/">
                                                Home
                                            </router-link>
                                        </MenuItem>
                                        <MenuItem>
                                            <router-link class="mobile-router-link" tag="li" to="/Manage">
                                                Manage & Create Trusts
                                            </router-link>
                                        </MenuItem>
                                        <MenuItem>
                                            <router-link class="mobile-router-link" tag="li" to="/Beneficiaries">
                                                For you (as Beneficiary)
                                            </router-link>
                                        </MenuItem>
                                        <MenuItem>
                                            <router-link class="mobile-router-link" tag="li" to="/Trustees">
                                                For Trustees
                                            </router-link>
                                        </MenuItem>
                                        <MenuItem>
                                            <router-link class="mobile-router-link" tag="li" to="/About">
                                                About
                                            </router-link>
                                        </MenuItem>
                                        <MenuItem>
                                            <router-link class="mobile-router-link" tag="li" to="/Developer">
                                                Developer
                                            </router-link>
                                        </MenuItem>
                                    </div>
                                </MenuItems>
                            </transition>
                        </Menu>

                    </div>
                    <div class="flex flex-grow items-center mr-3">
                        <div class="text-lg text-gray-100 tracking-tight subpixel-antialiased uppercase">
                            Safe <span class="font-thin -ml-1">Trust</span>
                        </div>
                    </div>

                    <div class="md:flex hidden items-center">
                        <router-link class="router-link" tag="li" to="/">
                            Home
                        </router-link>
                        <router-link class="router-link" tag="li" to="/Manage">
                            Manage Trusts
                        </router-link>
                        <router-link class="router-link" tag="li" to="/Beneficiaries">
                             Trusts for you
                        </router-link>
                        <router-link class="router-link" tag="li" to="/Trustees">
                             Trustees
                        </router-link>
                        <router-link class="router-link" tag="li" to="/About">
                            About
                        </router-link>
                        <router-link class="router-link" tag="li" to="/Developer">
                            Developer
                        </router-link>
                    </div>

                </div>
                <div class="flex items-center">
                    <ConnectButton/>
                </div>
            </div>
        </div>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

import Hamburger from './Hamburger.vue'
import ConnectButton from './ConnectButton.vue'

</script>

<style scoped>
    .nav {
        @apply mx-auto pl-2 pr-3;
        background-color: rgb(51, 51, 51);
    }

    .nav-items {
        @apply hidden md:ml-6 md:flex md:items-center md:space-x-4;
    }
    .router-link-active {
        @apply border border-gray-400 text-white px-3 py-2 rounded-md text-base font-normal;
    }
    .router-link {
        @apply flex-shrink-0 text-gray-200 hover:bg-black hover:text-white px-2 py-1 rounded-md text-sm font-light;
    }
    .mobile-router-link {
        @apply text-gray-300 hover:bg-gray-700 hover:text-white block px-2 py-2 rounded-md text-base font-thin;
    }
    .mobile-router-link-active {
        @apply bg-gray-900 text-white block px-2 py-2 rounded-md text-base font-thin;
    }

    .rotating {
        transition: transform 1s ease-in-out;
    }
    .rotating:hover {
        transform: rotateZ(360deg);
    }

    @keyframes rotating {
        from
            {
            transform: rotate(0deg);
            -o-transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            -moz-transform: rotate(0deg);
            -webkit-transform: rotate(0deg);
            }
        to
            {
            transform: rotate(360deg);
            -o-transform: rotate(360deg);
            -ms-transform: rotate(360deg);
            -moz-transform: rotate(360deg);
            -webkit-transform: rotate(360deg);
            }
    }
    @-webkit-keyframes rotating {
        from
            {
            transform: rotate(0deg);
            -webkit-transform: rotate(0deg);
            }
        to
            {
            transform: rotate(360deg);
            -webkit-transform: rotate(360deg);
            }
    }
    .rotating-always {
        -webkit-animation: rotating 30s linear infinite;
        -moz-animation: rotating 30s linear infinite;
        -ms-animation: rotating 30s linear infinite;
        -o-animation: rotating 30s linear infinite;
        animation: rotating 30s linear infinite;
    }

    .fadeslide-enter-active {
        @apply transition transform ease-in-out duration-500;
    }
    .fadeslide-enter-from {
        @apply  opacity-100 scale-y-0;
    }
    .fadeslide-enter-to {
        @apply  opacity-100 scale-y-100 ;
    }
    .fadeslide-leave-active {
        @apply transition ease-in duration-300;
    }
    .fadeslide-leave-from {
        @apply transform scale-y-100 opacity-100;
    }
    .fadeslide-leave-to {
        @apply transform opacity-100 scale-y-0;
    }
</style>
