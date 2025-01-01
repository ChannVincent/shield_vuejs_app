<template>
    <div class="mt-4 border-t border-gray-300 pt-4">
      <!-- Chat-style Comments -->
      <div class="h-64 overflow-y-auto mb-4 bg-gray-100 rounded-lg">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="mb-3 p-3 bg-gray-100 rounded-md shadow-sm"
        >
          <p class="text-sm text-gray-500 mb-1">{{ comment.username }}</p>
          <p class="text-gray-700">{{ comment.text }}</p>
        </div>
      </div>
  
      <!-- New Comment Form -->
      <form @submit.prevent="submitComment" class="flex items-center space-x-2">
        <input
          v-model="newComment"
          type="text"
          placeholder="Write a comment..."
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  // Props
  const props = defineProps({
    postId: Number,
  });
  
  // States
  const comments = ref([]);
  const newComment = ref('');
  
  // Load comments from API
  const loadComments = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/posts/${props.postId}/comments/`);
      comments.value = response.data;
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };
  
  // Submit a new comment
  const submitComment = async () => {
    if (!newComment.value.trim()) return;
  
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `http://localhost:8000/posts/${props.postId}/comments/`,
        { text: newComment.value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      comments.value.push(response.data); // Add new comment to the list
      newComment.value = ''; // Clear the input field
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  };
  
  onMounted(() => {
    loadComments();
  });
  </script>
  