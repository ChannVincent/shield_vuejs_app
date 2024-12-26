<script setup>
import { ref } from 'vue';

// Simulating current city name
const cityName = ref('My City');

// Handling post form data
const postText = ref('');
const posts = ref([
  { id: 1, text: 'Welcome to the feed!', photo: null },
  { id: 2, text: 'First post example.', photo: null },
]);

const addPost = (photo = null) => {
  if (postText.value.trim()) {
    posts.value.unshift({
      id: Date.now(),
      text: postText.value,
      photo,
    });
    postText.value = '';
  }
};

const openCamera = () => {
  // Simulating a photo capture for now
  const fakePhoto = 'data:image/jpeg;base64,fakePhotoData';
  addPost(fakePhoto);
};
</script>

<template>
  <div class="app">
    <!-- Top Navigation Bar -->
    <header class="nav-bar">
      <button class="burger-menu">&#9776;</button>
      <h1>{{ cityName }}</h1>
    </header>

    <!-- Main Content Area -->
    <div class="content">
      <div class="post-form">
        <textarea
          v-model="postText"
          placeholder="Write something..."
        ></textarea>
        <div class="actions">
          <button @click="addPost">Post</button>
          <button @click="openCamera">Take Photo</button>
        </div>
      </div>

      <!-- Feed Section -->
      <div class="feed">
        <div v-for="post in posts" :key="post.id" class="post">
          <p>{{ post.text }}</p>
          <img v-if="post.photo" :src="post.photo" alt="Post Photo" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.nav-bar {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  justify-content: space-between;
}

.burger-menu {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.post-form {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.post-form textarea {
  resize: none;
  height: 80px;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.actions button:first-child {
  background-color: #42b983;
  color: white;
}

.actions button:last-child {
  background-color: #888;
  color: white;
}

.feed {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.post img {
  margin-top: 0.5rem;
  max-width: 100%;
  border-radius: 4px;
}
</style>
