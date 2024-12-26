<template>
    <header class="sticky top-0 bg-white shadow-lg">
      <nav class="container flex flex-row items-center gap-4 text-primary h-20">
          <div 
          class="rounded-full bg-primary hover:bg-secondary text-white"
          style="width:45px;height:45px;text-align:center;"
          >
            <i 
            class="fa-solid fa-arrow-up-wide-short text-md"
            style="width:17px;height:17px;margin:14px;"
            />
          </div>
          <div class="m-auto">
            <RouterLink :to="{ name: 'BusinessListView' }">
                  <p class="text-2xl">PEA screener</p>
            </RouterLink>
          </div>
          <div 
          class="rounded-full bg-primary hover:bg-secondary text-white"
          style="width:45px;height:45px;text-align:center;"
          >
            <i 
            class="fa-solid fa-magnifying-glass text-md"
            style="width:17px;height:17px;margin:14px;"
            />
          </div>
      </nav>
    </header>
  </template>
  
  <script setup>
  import { RouterLink } from "vue-router"
  </script>