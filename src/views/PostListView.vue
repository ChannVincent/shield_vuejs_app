<template>
  <div class="container mx-auto py-4">
    <div class="flex justify-center">
      <!-- Wrapper for Post Form and Feed -->
      <div class="w-full max-w-lg">
        <!-- Post Form -->
        <div class="bg-white shadow-md rounded-md p-4 mb-6">
          <textarea
            v-model="text"
            placeholder="What's on your mind?"
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
              <span
                class="material-icons text-blue-500 hover:text-blue-600 text-4xl"
              >
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
              <span
                class="material-icons text-blue-500 hover:text-blue-600 text-4xl"
              >
                photo_camera
              </span>
            </button>

            <!-- Post Button -->
            <button
              @click="handlePost"
              class="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 focus:ring focus:ring-blue-300"
            >
              <span class="material-icons text-white mr-2">
                send
              </span>
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

        <!-- Feed -->
        <div class="space-y-4">
          <div
            v-for="post in posts"
            :key="post.id"
            class="bg-white shadow-md rounded-md p-4"
          >
            <p v-if="post.text" class="mb-2">{{ post.text }}</p>
            <div v-if="post.media" class="mt-2">
              <!-- Image Handling -->
              <template v-if="post.mediaType.startsWith('image/')">
                <img
                  :src="post.media"
                  alt="Posted media"
                  :class="{
                    'w-full h-60 object-cover': !post.isExpanded,
                    'w-full h-auto': post.isExpanded
                  }"
                  class="rounded-md"
                  style="object-fit: cover; aspect-ratio: 1 / 1;"
                />
                <button
                  @click="toggleImageExpand(post)"
                  class="flex justify-center w-full mt-1"
                  title="Expand/Collapse"
                >
                  <span
                    class="material-icons text-blue-500 hover:text-blue-600 text-4xl"
                  >
                    {{ post.isExpanded ? 'expand_less' : 'expand_more' }}
                  </span>
                </button>
              </template>
              <!-- Video Handling -->
              <video
                v-else-if="post.mediaType.startsWith('video/')"
                controls
                class="rounded-md max-w-full"
              >
                <source :src="post.media" :type="post.mediaType" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, watch } from 'vue';

const posts = ref([]);
const text = ref('');
const media = ref(null);
const mediaPreview = ref(null);
const mediaType = ref(null);
const isMobile = ref(false);

const handlePost = () => {
  if (!text.value.trim() && !media.value) return;

  const newPost = {
    id: Date.now(),
    text: text.value,
    media: media.value ? URL.createObjectURL(media.value) : null,
    mediaType: media.value ? media.value.type : null,
    mediaPreview: mediaPreview.value,
    isExpanded: false, // Default state for image/video
  };

  posts.value.unshift(newPost);
  text.value = '';
  media.value = null;
  mediaPreview.value = null;
};

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

// Watch for mobile device detection
watch(
  () => window.innerWidth,
  () => {
    isMobile.value = window.innerWidth <= 768;
  },
  { immediate: true }
);

const toggleImageExpand = (post) => {
  post.isExpanded = !post.isExpanded;
};
</script>

<style scoped>
/* Optional: Add custom styles if necessary */
</style>
