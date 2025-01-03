<template>
  <div class="bg-white shadow-md rounded-md p-4 mb-6">
    <textarea
      v-model="text"
      placeholder="Je dénonce une injustice !"
      class="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring focus:ring-blue-300"
      rows="3"
    ></textarea>

    <div class="mt-4 flex items-center justify-between">
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
      >
        <span class="material-icons text-blue-500 hover:text-blue-600 text-4xl">
          add_photo_alternate
        </span>
      </label>

      <!-- Camera Button (Mobile Only) -->
      <button
        v-if="isMobile"
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
        class="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 focus:ring focus:ring-blue-300"
      >
        <span class="material-icons text-white mr-2">send</span>
        Post
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
import axios from 'axios';

// Props and emits
const emit = defineEmits(['createPost']);

// Reactive states
const text = ref('');
const media = ref(null);
const mediaPreview = ref(null);
const mediaType = ref(null);
const isMobile = ref(false);

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

  const formData = new FormData();
  formData.append('commune', 2); // Commune ID set to 2
  formData.append('text', text.value); // Post text
  if (media.value) {
    formData.append('image', media.value); // Attach the image file if it exists
  }

  const token = localStorage.getItem('authToken'); // Get the token from localStorage

  try {
    const response = await axios.post('http://localhost:8000/posts/create/', formData, {
      headers: {
        'Authorization': `Bearer ${token}`, // Include the JWT token in the Authorization header
        'Content-Type': 'multipart/form-data', // Ensure the request is sent as multipart/form-data
      },
    });

    // Emit the created post to the parent component
    emit('createPost', { id: response.data.post_id, ...response.data });

    // Clear the form
    text.value = '';
    media.value = null;
    mediaPreview.value = null;
  } catch (error) {
    console.error('Error creating post:', error.response ? error.response.data : error.message);
    alert('Failed to create post. Please try again.');
    if (error.status == 401) {
      localStorage.removeItem('authToken');
      next('/login');
    }
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
