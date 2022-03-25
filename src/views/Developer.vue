<!--
    TESTING goes here
-->
<template>
    <div>
        
        <PageTitle>
            <template v-slot:title>Developer View 
            </template>
        </PageTitle> 
        
        <div class="first-letter:font-bold first-letter:text-3xl first-letter:text-teal-500 indent-5 mt-5 ml-5">
        Hello friend! This is the developer view.  It shows all trusts regardless of creator.  You can use this view for debugging purposes. 
        </div>
       <div class="flex space-x-2 p-2 items-center justify-center">
            <div class="bg-gray-500 py-2 p-2 text-center rounded-md">One</div>
            <div class="py-3 p-2 grow border-2 text-center rounded-md"></div>
            <div class="text-center py-2 bg-blue-500 p-2 rounded-md">Three four five six seven eight</div>
        </div>
        <DeveloperList class="bg-white"/>
<!--
        <Combobox as="div" class="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all" v-model="selectedPerson">
          <div class="relative">
            <ComboboxInput class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-800 placeholder-gray-400 focus:ring-0 sm:text-sm" placeholder="Search..." @change="query = $event.target.value" />
          </div>

          <ComboboxOptions static class="max-h-96 scroll-py-3 overflow-y-auto p-3">
            <ComboboxOption v-for="person in filteredPeople" :key="person" :value="selectedPerson" as="template">
              {{ person }}
            </ComboboxOption>
          </ComboboxOptions>

        </Combobox>
-->
        Filter: <input class="p-1 mt-1 text-black" v-model='query' placeholder="First Name...">
        <div v-if="filteredPeople.length > 0">
            <div v-for="person in filteredPeople" :key="person">
                {{ person }}
            </div>
        </div>
        <div v-else class="text-red-500">Noone found</div>

        <div class="mt-5">S: {{selectedPerson}},  </div>
        <div>P: {{people}},  </div>
        <div>Q: {{query}},  </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// components
import Test from '../components/Test.vue';
import PageTitle from '../components/PageTitle.vue';
import DeveloperList from '../components/DeveloperList.vue';

const people = [
    'Apple',
    'Banana',
    'Carrott',
    'Durian Fruit',
]
const selectedPerson = ref(people[0]);
const query = ref('');
const filteredPeople = computed(() => 
  query.value === ''
      ? people
      : people.filter((person) => {
          return person.toLowerCase().includes(query.value.toLowerCase())
        })
  )
</script>

<style scoped>

</style>

