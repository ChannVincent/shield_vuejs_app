<template>
  <div class="mt-4 border-t border-gray-300 pt-4">
    <!-- Chat-style Comments -->
    <div class="h-64 overflow-y-auto mb-4 bg-gray-100 rounded-lg flex flex-col items-start justify-start">
      <div v-if="comments.length === 0" class="flex justify-center items-center h-full">
        <p class="text-gray-500 italic ml-5">No message yet, send the first message!</p>
      </div>
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="mb-3 p-3 bg-blue-500 text-white rounded-lg shadow-md max-w-sm self-start"
      >
        <p class="text-sm text-gray-200 mb-1 font-semibold">{{ comment.user }}</p>
        <p class="text-white">{{ comment.text }}</p>
      </div>
    </div>

    <!-- New Comment Form -->
    <form @submit.prevent="submitComment" class="flex items-center space-x-2">
      <input
        v-model="newComment"
        type="text"
        placeholder="Envoyer un message..."
        class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <button
        type="submit"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Envoyer
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
    const token = localStorage.getItem('authToken');
    const response = await axios.get(
      `http://localhost:8000/posts/${props.postId}/comments/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    comments.value = response.data.comments; // Update to use the 'comments' field from API
  } catch (error) {
    console.error('Failed to load comments:', error.response?.data || error.message);
  }
};

// Submit a new comment
const submitComment = async () => {
  if (!newComment.value.trim()) return;

  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.post(
      `http://localhost:8000/posts/${props.postId}/comment/`,
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
    console.error('Failed to submit comment:', error.response?.data || error.message);
  }
};

onMounted(() => {
  loadComments();
});
</script>

<style>
/* Center message container when no messages exist */
.h-64 .flex {
  text-align: center;
}

/* Bubble styling for messages */
.bg-blue-500 {
  position: relative;
  padding: 1rem;
  margin: 0.5rem;
  border-radius: 10px;
}
</style>
