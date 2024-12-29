<template>
  <div class="bg-white shadow-md rounded-md pt-4 px-4">
    <p v-if="post.text">{{ post.text }}</p>
    
    <!-- Chart Section -->
    <div v-if="post.json_data" class="pt-4">
        <canvas ref="chartCanvas" width="400" height="200"></canvas>
    </div>
    
    <div v-if="!post.image" class="pb-4"></div>
    <div v-if="post.image" class="mt-2">
      <!-- Image Handling -->
      <img
        :src="'http://localhost:8000/media/' + post.image"
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
        <span class="material-icons text-blue-500 hover:text-blue-600 text-4xl">
          {{ post.isExpanded ? 'expand_less' : 'expand_more' }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  post: Object,
});

const chartCanvas = ref(null); // Create a ref for the canvas

const toggleImageExpand = () => {
  props.post.isExpanded = !props.post.isExpanded;
};

onMounted(() => {
  if (chartCanvas.value && props.post.json_data) {
    // Access the canvas element via the ref
    const ctx = chartCanvas.value.getContext('2d');

    // Parse the JSON data
    const jsonData = JSON.parse(props.post.json_data);
    const years = jsonData.map((item) => item.year);
    const factsValues = jsonData.map((item) => parseFloat(item.facts_value));

    // Create the chart
    new Chart(ctx, {
      type: 'line', // Chart type
      data: {
        labels: years,
        datasets: [
          {
            label: props.post.text,
            data: factsValues,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
});
</script>
