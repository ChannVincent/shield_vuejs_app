<template>
  <div class="bg-white shadow-md rounded-md pt-4 px-4 relative">
    <!-- User Section -->
    <div v-if="post.user_username || post.user_image" class="flex items-center mb-4 mr-28">
      <img
        v-if="post.user_image"
        :src="baseUrl + post.user_image"
        alt="User profile"
        class="w-10 h-10 rounded-full object-cover mr-3"
      />
      <p v-if="post.user_username" class="text-gray-800 font-medium">{{ post.user_username }}</p>
      <RankIcon :rank="post.user_rank" />
      <p class="text-gray-400 text-xs">rang {{ post.user_rank }}</p>
    </div>

    <!-- Buttons Section (Top Right) -->
    <div class="absolute top-4 right-4 flex items-center space-x-4 text-gray-700">
      <!-- Comment Button -->
      <button @click="toggleComments" class="flex items-center hover:text-blue-500">
        <span v-if="!showComments" class="material-icons text-2xl">chat_bubble_outline</span>
        <span v-else class="material-icons text-2xl">chat_bubble</span>
        <span class="ml-2">{{ commentCount }}</span>
      </button>

      <!-- Like Button -->
      <button @click="toggleLike" class="flex items-center hover:text-red-500">
        <span class="material-icons text-2xl">
          {{ isLiked ? 'favorite' : 'favorite_border' }}
        </span>
        <span class="ml-2">{{ likeCount }}</span>
      </button>
    </div>

    <!-- Title Section -->
    <p class="text-lg mr-28" v-if="post.title">{{ post.title }}</p>

    <!-- Comment Section -->
    <CommentSection v-if="showComments" @onCommentCountChanged="onCommentCountChanged" :postId="post.id" />

    <!-- Text Section -->
    <p class="mt-3 ml-3" v-if="post.text">{{ post.text }}</p>

    <!-- Chart Section -->
    <div v-if="post.json_data" class="pt-4">
      <canvas ref="chartCanvas" width="400" height="200"></canvas>
    </div>

    <!-- Image Section -->
    <div v-if="!post.image" class="pb-4"></div>
    <div v-if="post.image" class="mt-2">
      <img
        :src="baseUrl + post.image"
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

    <!-- end sections -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import { baseUrl, toggleLikePost } from '@/api/post';
import CommentSection from '@/components/CommentSection.vue';
import RankIcon from '@/components/RankIcon.vue';

const props = defineProps({
  post: Object,
});

const chartCanvas = ref(null);
const imageWidth = ref(0);
const imageHeight = ref(0);
const showComments = ref(false);

// State for likes
const isLiked = ref(props.post.is_liked);
const likeCount = ref(props.post.like_count);
const commentCount = ref(props.post.comment_count);

const toggleImageExpand = () => {
  props.post.isExpanded = !props.post.isExpanded;
};

const toggleComments = () => {
  showComments.value = !showComments.value;
};

const onCommentCountChanged = (count) => {
  commentCount.value = count
}

const toggleLike = async () => {
  try {
    const data = await toggleLikePost(props.post.id);
    isLiked.value = data.liked;
    likeCount.value = data.like_count;
  } catch (error) {
    console.error(error.message);
    if (error.message === 'Unauthorized') {
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
      `${baseUrl}/${props.post.image}`
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
            label: props.post.title,
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
