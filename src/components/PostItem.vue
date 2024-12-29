<template>
  <div class="bg-white shadow-md rounded-md pt-4 px-4">
    <p v-if="post.text">{{ post.text }}</p>
    
    <!-- Chart Section -->
    <div v-if="post.json_data" class="pt-4">
      <canvas id="myChart" width="400" height="200"></canvas>
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
import Chart from 'chart.js/auto'; // Import Chart.js

const props = defineProps({
  post: Object,
});

// Function to toggle image expand
const toggleImageExpand = () => {
  props.post.isExpanded = !props.post.isExpanded;
};

// Chart setup
onMounted(() => {
  const ctx = document.getElementById('myChart').getContext('2d');
  
  if (props.post.json_data) {
    // Data extraction from post
    const jsonData = JSON.parse(props.post.json_data); // Assuming your data is in JSON format
    const years = jsonData.map(item => item.year);
    const factsValues = jsonData.map(item => parseFloat(item.facts_value));

    new Chart(ctx, {
      type: 'line', // You can change this to 'bar' or other types as needed
      data: {
        labels: years, // Years as the x-axis
        datasets: [
          {
            label: 'Usage de stupéfiants - Facts Value',
            data: factsValues, // Facts value for the y-axis
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