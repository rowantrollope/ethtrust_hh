<!--
    Navigation bar 
--> 
<template>
<div class="mx-auto px-2 h-11" style="background-color: rgb(51, 51, 51);">
    <div class="flex h-full justify-between">
        <div class="grow flex items-center">
            <!--
                Mobile menu
            -->
            <div class="md:hidden">
                <!-- Mobile menu button -->
                <Menu as="nav" v-slot="{ open }">
                    <MenuButton>
                        <span class="sr-only">Open main menu</span>
                        <Hamburger :open="open"/>
                    </MenuButton>
                    <transition name="slide">
                        <MenuItems class="origin-top-left absolute mt-2 -ml-2 px-2 w-full h-full pt-5 pb-5 shadow-lg bg-black ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                            <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                                <MenuItem>
                                    <router-link class="mobile-router-link" tag="li" to="/">
                                        Home
                                    </router-link>
                                </MenuItem>
                                <MenuItem>
                                    <router-link class="mobile-router-link" tag="li" to="/Manage">
                                        <div class="relative w-min whitespace-nowrap">
                                            Manage & Create Trusts
                                            <NotificationBadge v-if="stats.isGrantor.value">{{stats.grantorTrusts}}</NotificationBadge>
                                        </div>
                                    </router-link>
                                </MenuItem>
                                <MenuItem>
                                    <router-link class="mobile-router-link" tag="li" to="/Beneficiaries">
                                        <div class="relative w-min whitespace-nowrap">
                                            Beneficiaries - Trusts created for you
                                            <NotificationBadge v-if="stats.isBeneficiary.value">{{stats.beneficiaryTrusts}}</NotificationBadge>
                                        </div>
                                    </router-link>
                                </MenuItem>
                                <MenuItem>
                                    <router-link class="mobile-router-link" tag="li" to="/Trustees">
                                        <div class="relative w-min whitespace-nowrap">
                                            Trustees - Manage Trusts as Trustee
                                            <NotificationBadge v-if="stats.isTrustee.value">{{stats.trusteeTrusts}}</NotificationBadge>
                                        </div>
                                    </router-link>
                                </MenuItem>
                                <MenuItem>
                                    <router-link class="mobile-router-link" tag="li" to="/About">
                                        About
                                    </router-link>
                                </MenuItem>
                                <MenuItem v-if="store.state.developerMode" >
                                    <router-link class="mobile-router-link" tag="li" to="/Developer">
                                        Developer
                                    </router-link>
                                </MenuItem>
                            </div>
                        </MenuItems>
                    </transition>
                </Menu>

            </div>
            
            <!-- Brand name --> 
            <div class="mr-3 sm:ml-1 text-lg text-gray-100 tracking-tight subpixel-antialiased whitespace-nowrap uppercase">
                Safe<span class="font-thin"> Trust</span>
            </div>
            
            <!-- Normal desktop menu items --> 
            <div class="md:flex hidden items-center">
                <router-link class="router-link" tag="li" to="/">
                    Home
                </router-link>
                <router-link class="router-link" tag="li" to="/Manage">
                    <div class="relative">
                        Manage & Create
                        <NotificationBadge v-if="stats.isGrantor.value">{{stats.grantorTrusts}}</NotificationBadge>
                    </div>
                </router-link>
                <router-link class="router-link" tag="li" to="/Beneficiaries">
                    <div class="relative">
                    Beneficiaries
                        <NotificationBadge v-if="stats.isBeneficiary.value">{{stats.beneficiaryTrusts}}</NotificationBadge>
                    </div>
                </router-link>
                <router-link class="router-link" tag="li" to="/Trustees">
                    <div class="relative">
                        Trustees
                        <NotificationBadge v-if="stats.isTrustee.value">{{stats.trusteeTrusts}}</NotificationBadge>
                    </div>
                </router-link>
                <router-link class="router-link" tag="li" to="/About">
                    About
                </router-link>
                <router-link v-if="store.state.developerMode" class="router-link" tag="li" to="/Developer">
                    Developer
                </router-link>
            </div>

        </div>
        
        <!-- Connect button (ON THE RIGHT) --> 
        <div class="flex items-center">
            <ConnectButton/>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">

// 3rd party Components
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

// components
import Hamburger from './Hamburger.vue'
import ConnectButton from './ConnectButton.vue'
import NotificationBadge from './NotificationBadge.vue'

// services
import { useTrustStats } from '../services/TrustStats'
import { useStore } from '../store';

const store = useStore();
const stats = useTrustStats();

</script>

<style scoped>

    .nav-items {
        @apply hidden md:ml-6 md:flex md:items-center md:space-x-4;
    }
    .router-link-active {
        @apply border border-gray-400 px-3 py-2 rounded-md text-base font-normal;
    }
    .router-link {
        @apply text-white whitespace-nowrap hover:bg-black hover:text-white px-2 ml-2 py-1 rounded-md text-sm font-light;
    }
    .mobile-router-link {
        @apply text-gray-300 hover:bg-gray-700 hover:text-white block px-2 py-2 rounded-md text-base font-thin;
    }
    .mobile-router-link-active {
        @apply bg-gray-900 text-white block px-2 py-2 rounded-md text-base font-thin;
    }
    .fadeslide-enter-active {
        @apply transition transform ease-in-out duration-500;
    }
    .fadeslide-enter-from {
        @apply transition transform opacity-100 scale-y-0;
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

    .slide-enter-active,
    .slide-leave-active {
        transition: max-height 0.5s ease-in-out
    }
    .slide-enter-to,
    .slide-leave-from {
        overflow: hidden;
        max-height: 10000px;
    }
    .slide-enter-from,
    .slide-leave-to {
        overflow: hidden;
        max-height: 0;
    }
</style>
