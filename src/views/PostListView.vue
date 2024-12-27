<template>
  <div class="container mx-auto py-4">
    <div class="flex justify-center">
      <!-- Wrapper for Post Form and Feed -->
      <div class="w-full max-w-lg">
        <!-- Post Form -->
        <PostForm @createPost="addPost" />

        <!-- Feed -->
        <div class="space-y-4">
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
import { ref } from 'vue';
import PostForm from '@/components/PostForm.vue';
import PostItem from '@/components/PostItem.vue';

const posts = ref([]);

// Add new post to the posts array
const addPost = (newPost) => {
  posts.value.unshift(newPost);
};
</script>
