<template>
  <div>
    <Navigation :title="title"/>
    <div class="container mx-auto py-4">
      <div class="flex justify-center">
        <!-- Wrapper for Post Form and Feed -->
        <div class="w-full max-w-lg">
          <!-- Post Form -->
          <PostForm @createPost="addPost" />

          <!-- Spinner -->
          <Spinner v-if="loading" />

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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navigation from '@/components/Navigation.vue'
import PostForm from '@/components/PostForm.vue';
import PostItem from '@/components/PostItem.vue';
import Spinner from '@/components/Spinner.vue';
import { fetchPosts as fetchPostsApi } from '@/api/post';

// TODO put in store
const commune_id = 2;

const posts = ref([]);
const loading = ref(true);
const title = localStorage.getItem('commune') ?? 'Nom commune'

// Add new post to the posts array
const addPost = (newPost) => {
  fetchPosts();
};

// Fetch posts from the API
const fetchPosts = async () => {
  try {
    posts.value = await fetchPostsApi();
  } catch (error) {
    console.error(error.message);
    if (error.message === 'Unauthorized') {
      next('/login');
    }
  } finally {
    loading.value = false;
  }
};

// Fetch posts when the component is mounted
onMounted(() => {
  fetchPosts();
});
</script>
