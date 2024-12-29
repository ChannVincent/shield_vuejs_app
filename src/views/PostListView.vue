<template>
  <div class="container mx-auto py-4">
    <div class="flex justify-center">
      <!-- Wrapper for Post Form and Feed -->
      <div class="w-full max-w-lg">
        <!-- Post Form -->
        <PostForm @createPost="addPost" />

        <!-- Spinner -->
        <div v-if="loading" class="flex justify-center items-center">
          <div class="spinner"></div>
        </div>

        <!-- Feed -->
        <div v-else class="space-y-4">
          <PostItem
            v-for="post in posts"
            :key="post.id"
            :post="post"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PostForm from '@/components/PostForm.vue';
import PostItem from '@/components/PostItem.vue';
import axios from 'axios';

// TODO put in store
const commune_id = 0

const posts = ref([]);
const loading = ref(true);

// Add new post to the posts array
const addPost = (newPost) => {
  posts.value.unshift(newPost);
};

// Fetch posts from the API
const fetchPosts = async () => {
  try {
    const response = await axios.get('http://localhost:8000/posts/?commune_id=0');
    posts.value = response.data;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  } finally {
    loading.value = false;
  }
};

// Fetch posts when the component is mounted
onMounted(() => {
  fetchPosts();
});
</script>

<style>
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
