<template>
    <div class="bg-white shadow-md rounded-md pt-4 px-4">
        <p v-if="post.text">{{ post.text }}</p>
        <div v-if="!post.media" class="pb-4"></div>
        <div v-if="post.media" class="mt-2">
            <!-- Image Handling -->
            <template v-if="post.mediaType.startsWith('image/')">
            <img
                :src="post.media"
                alt="Posted media"
                :class="{
                'w-full h-60 object-cover': !post.isExpanded,
                'w-full h-auto': post.isExpanded
                }"
                class="rounded-md"
                style="object-fit: cover; aspect-ratio: 1 / 1;"
            />
            <button
                @click="toggleImageExpand"
                class="flex justify-center w-full"
                title="Expand/Collapse"
            >
                <span
                class="material-icons text-blue-500 hover:text-blue-600 text-4xl"
                >
                {{ post.isExpanded ? 'expand_less' : 'expand_more' }}
                </span>
            </button>
            </template>
            <!-- Video Handling -->
            <video
            v-else-if="post.mediaType.startsWith('video/')"
            controls
            class="rounded-md max-w-full"
            >
            <source :src="post.media" :type="post.mediaType" />
            Your browser does not support the video tag.
            </video>
        </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    post: Object,
  });
  
  const toggleImageExpand = () => {
    props.post.isExpanded = !props.post.isExpanded;
  };

  ref({
    chartData: {
      labels: ["2024-12-20", "2024-12-21", "2024-12-22", "2024-12-23", "2024-12-24", "2024-12-25", "2024-12-26"],
      datasets: [
        {
          label: "User Activity",
          data: [10, 15, 12, 8, 20, 25, 30],
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
  })
  </script>
  