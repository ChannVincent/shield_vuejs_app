<template>
  <header class="sticky top-0 bg-white shadow-lg">
    <nav class="container flex flex-row items-center gap-4 text-blue-500 h-20">
      <div class="m-auto">
        <RouterLink :to="{ name: 'PostListView' }">
          <p class="text-2xl">{{ title }}</p>
        </RouterLink>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink } from "vue-router"

// Props to receive the dynamic title
defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>