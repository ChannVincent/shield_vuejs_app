<template>
  <div class="mt-4 border-t border-gray-300 pt-4">
    <!-- Chat-style Comments -->
    <div
      ref="commentContainer"
      class="h-64 overflow-y-auto mb-4 bg-gray-100 rounded-lg flex flex-col items-start justify-start"
    >
      <div v-if="comments.length === 0" class="flex justify-center items-center h-full">
        <p class="text-gray-500 italic ml-5">No message yet, send the first message!</p>
      </div>
      
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="mb-3 flex flex-col"
        :class="{ 'self-end items-end': comment.from_me, 'self-start items-start': !comment.from_me }"
      >
        <div
          class="flex items-center mx-2"
          :class="{ 'flex-row-reverse': comment.from_me }"
        >
          <img
            v-if="comment.user_image"
            :src="'http://localhost:8000/' + comment.user_image"
            alt="User image"
            class="w-6 h-6 rounded-full border border-gray-300 mx-2 mt-1"
          />
          <p class="text-sm text-gray-500 font-semibold">{{ comment.user }}</p>
          <RankIcon :rank="comment.user_rank" />
        </div>
        <div
          class="p-3 rounded-lg shadow-md max-w-sm"
          :class="{ 'bg-blue-500 text-white': comment.from_me, 'bg-gray-300 text-gray-800': !comment.from_me }"
        >
          <p class="break-words">{{ comment.text }}</p>
        </div>
      </div>

      <!-- Last Updated and Refresh Button -->
      <div class="flex justify-between items-center text-sm text-gray-400 px-2">
        <span class="pb-2">Mise à jour à {{ lastUpdated }} - rafraîchir:</span>
        <button
          @click="refreshComments"
          class="px-1 text-gray-400 hover:text-blue-600 focus:outline-none"
        >
          <span class="material-icons text-md">refresh</span>
        </button>
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
import { ref, onMounted, watch, nextTick } from 'vue';
import { fetchComments, submitNewComment } from '@/api/post';
import RankIcon from '@/components/RankIcon.vue';

// Props
const props = defineProps({
  postId: Number,
});

// States
const comments = ref([]);
const newComment = ref('');
const commentContainer = ref(null); // Reference for the comment container
const lastUpdated = ref('Never'); // Tracks the last updated time
const emit = defineEmits(['onCommentCountChanged']);

// Scroll to the bottom of the comment container
const scrollToBottom = () => {
  nextTick(() => {
    if (commentContainer.value) {
      commentContainer.value.scrollTop = commentContainer.value.scrollHeight;
    }
  });
};

// Update the last updated time
const updateLastUpdated = () => {
  const now = new Date();
  lastUpdated.value = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// Load comments from API
const loadComments = async () => {
  try {
    comments.value = await fetchComments(props.postId);
    emit('onCommentCountChanged', comments.value.length);
    // Update the last updated time and scroll to bottom
    updateLastUpdated();
    scrollToBottom();
  } catch (error) {
    console.error('Failed to load comments:', error.response?.data || error.message);
  }
};

// Refresh comments
const refreshComments = async () => {
  await loadComments();
};

// Submit a new comment
const submitComment = async () => {
  if (!newComment.value.trim()) return;
  try {
    await submitNewComment(props.postId, newComment.value);
    newComment.value = ''; // Clear the input field
    await loadComments(); // Reload comments to include the new one
  } catch (error) {
    console.error('Failed to submit comment:', error.response?.data || error.message);
  }
};

// Watch for changes in the comments array and scroll to bottom
watch(comments, scrollToBottom);

// On mounted, load comments and scroll to bottom
onMounted(() => {
  loadComments();
  scrollToBottom();
});
</script>

<style>
/* Center message container when no messages exist */
.h-64 .flex {
  text-align: center;
}

/* Bubble styling for messages */
.bg-blue-500,
.bg-gray-300 {
  padding: 1rem;
  margin: 0.5rem;
  border-radius: 10px;
  word-wrap: break-word;
}
</style>
