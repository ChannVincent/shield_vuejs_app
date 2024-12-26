<template>
    <header class="sticky top-0 bg-white shadow-lg">
      <nav class="container flex flex-row items-center gap-4 text-primary h-20">
          <RouterLink :to="{ name: 'BusinessListView' }">
            <div 
            class="rounded-full bg-primary hover:bg-secondary text-white"
            style="width:45px;height:45px;text-align:center;"
            >
              <i 
                class="fa-solid fa-arrow-left-long text-md"
                style="width:17px;height:17px;margin:14px;"
              />
            </div>
          </RouterLink>
          <div class="m-auto">
              <p class="text-2xl">{{ title }}</p>
          </div>
          <div 
            style="width:45px;"
          >
          </div>
      </nav>
    </header>
  </template>
  
  <script>
  import { RouterLink } from "vue-router"
  export default {
      props: {
          title: {
              type: String,
              default: null,
              required: true,
          },
      },
  }
  </script>