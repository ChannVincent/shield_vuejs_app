<template>
  <div class="bg-white shadow-md rounded-md p-4 mb-6">
    <!-- Textarea for Post Content -->
    <textarea
      v-model="text"
      placeholder="Je dénonce une injustice !"
      class="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring focus:ring-blue-300"
      :disabled="isLoading"
      rows="3"
    ></textarea>

    <div
      class="mt-4 flex items-center space-x-4"
      :class="isLoading ? 'justify-end' : 'justify-between'"
    >
      <!-- File Input for Image/Video -->
      <input
        type="file"
        accept="image/*,video/*"
        @change="handleMediaChange"
        class="hidden"
        id="mediaInput"
      />
      <label
        for="mediaInput"
        class="cursor-pointer"
        title="Choose Image/Video"
        v-if="!isLoading"
      >
        <span class="material-icons text-blue-500 hover:text-blue-600 text-4xl">
          add_photo_alternate
        </span>
      </label>

      <!-- Camera Button (Mobile Only) -->
      <button
        v-if="isMobile && !isLoading"
        @click="captureImage"
        class="cursor-pointer"
        title="Use Camera"
      >
        <span class="material-icons text-blue-500 hover:text-blue-600 text-4xl">
          photo_camera
        </span>
      </button>

      <!-- Post Button -->
      <button
        @click="handlePost"
        :disabled="isLoading"
        class="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 focus:ring focus:ring-blue-300"
      >
        <span v-if="!isLoading" class="material-icons text-white mr-2">send</span>
        <span v-else class="mr-2">
          <SpinnerWaiting color="text-white" />
        </span>
        <span>{{ isLoading ? 'Posting...' : 'Post' }}</span>
      </button>
    </div>

    <!-- Image Preview -->
    <div v-if="mediaPreview" class="mt-4">
      <p>Preview:</p>
      <div v-if="mediaType.startsWith('image/')" class="relative">
        <img
          :src="mediaPreview"
          alt="Preview"
          class="rounded-md max-w-full h-auto"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { createPost } from '@/api/post';
import SpinnerWaiting from '@/components/SpinnerWaiting.vue';

// Props and emits
const emit = defineEmits(['createPost']);

// Reactive states
const text = ref('');
const media = ref(null);
const mediaPreview = ref(null);
const mediaType = ref(null);
const isMobile = ref(false);
const isLoading = ref(false); // Loading state for post creation

// Function to check screen width
const updateIsMobile = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth <= 768; // Adjust the breakpoint as needed
  }
};

// Lifecycle hooks
onMounted(() => {
  updateIsMobile(); // Initial check
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateIsMobile); // Add listener for resizing
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateIsMobile); // Remove listener
  }
});

// Handle post creation
const handlePost = async () => {
  if (!text.value.trim() && !media.value) {
    alert("Post content or image can't be empty.");
    return;
  }

  isLoading.value = true; // Set loading state to true
  try {
    const response = await createPost(text.value, media.value); // Call API function
    // Emit response to parent
    emit('createPost', { id: response.post_id, ...response });
    // Clear the form
    text.value = '';
    media.value = null;
    mediaPreview.value = null;
  } catch (error) {
    console.error(error.message);
    alert('Failed to create post. Please try again.');
    if (error.message === 'Unauthorized') {
      next('/login');
    }
  } finally {
    isLoading.value = false; // Reset loading state
  }
};

// Handle media change
const handleMediaChange = (event) => {
  const file = event.target.files[0];
  if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
    media.value = file;
    mediaPreview.value = URL.createObjectURL(file);
    mediaType.value = file.type;
  } else {
    alert('Please select an image or video file.');
  }
};

// Capture image using camera
const captureImage = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.capture = 'camera';
  input.onchange = (e) => {
    handleMediaChange(e);
  };
  input.click();
};
</script>
