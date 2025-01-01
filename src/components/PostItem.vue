<template>
  <div class="bg-white shadow-md rounded-md pt-4 px-4">
    <!-- User Section -->
    <div v-if="post.user_username && post.user_image" class="flex items-center mb-4">
      <img
        :src="'http://localhost:8000' + post.user_image"
        alt="User profile"
        class="w-10 h-10 rounded-full object-cover mr-3"
      />
      <p class="text-gray-800 font-medium">{{ post.user_username }}</p>
    </div>

    <!-- Text Section -->
    <p class="text-lg" v-if="post.title">{{ post.title }}</p>
    <p class="mt-3 ml-3" v-if="post.text">{{ post.text }}</p>

    <!-- Chart Section -->
    <div v-if="post.json_data" class="pt-4">
      <canvas ref="chartCanvas" width="400" height="200"></canvas>
    </div>

    <!-- Image Section -->
    <div v-if="!post.image" class="pb-4"></div>
    <div v-if="post.image" class="mt-2">
      <img
        :src="'http://localhost:8000/' + post.image"
        alt="Posted media"
        :class="{
          'w-full h-auto': imageWidth >= imageHeight,
          'w-full aspect-video object-cover': imageWidth < imageHeight && !post.isExpanded,
          'w-full h-auto': imageWidth < imageHeight && post.isExpanded,
        }"
        class="rounded-md"
      />
      <button
        v-if="imageWidth < imageHeight"
        @click="toggleImageExpand"
        class="flex justify-center w-full"
        title="Expand/Collapse"
      >
        <span class="material-icons text-blue-500 hover:text-blue-600 text-4xl">
          {{ post.isExpanded ? 'expand_less' : 'expand_more' }}
        </span>
      </button>
      <div v-else class="p-2"></div>
    </div>
    
    <!-- Like Button Section -->
    <div class="flex items-center justify-between mt-4 pb-4">
      <button
        @click="toggleLike"
        class="flex items-center text-gray-700 hover:text-red-500"
      >
        <span class="material-icons text-2xl">
          {{ isLiked ? 'favorite' : 'favorite_border' }}
        </span>
        <span class="ml-2">{{ likeCount }}</span>
      </button>
    </div>

    <!-- end sections -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import axios from 'axios';

const props = defineProps({
  post: Object,
});

const chartCanvas = ref(null); // Create a ref for the canvas
const imageWidth = ref(0);
const imageHeight = ref(0);

// State for likes
const isLiked = ref(props.post.is_liked);
const likeCount = ref(props.post.like_count);

const toggleImageExpand = () => {
  props.post.isExpanded = !props.post.isExpanded;
};

const toggleLike = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.post(`http://localhost:8000/posts/${props.post.id}/like/`, null, {
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'multipart/form-data',
      },
    });
    isLiked.value = response.data.liked;
    likeCount.value = response.data.like_count;
  } catch (error) {
    console.error('Failed to toggle like:', error);
    if (error.status == 401) {
      localStorage.removeItem('authToken');
      next('/login');
    }
  }
};

const loadImageDimensions = async (imageSrc) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.src = imageSrc;
  });
};

onMounted(async () => {
  // Load image dimensions
  if (props.post.image) {
    const { width, height } = await loadImageDimensions(
      `http://localhost:8000/${props.post.image}`
    );
    imageWidth.value = width;
    imageHeight.value = height;
  }

  // Render chart if JSON data is available
  if (chartCanvas.value && props.post.json_data) {
    const ctx = chartCanvas.value.getContext('2d');

    const jsonData = JSON.parse(props.post.json_data);
    const years = jsonData.map((item) => item.year);
    const factsValues = jsonData.map((item) => parseFloat(item.facts_value));

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: props.post.text,
            data: factsValues,
            backgroundColor: props.post.color,
            borderColor: props.post.color,
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
