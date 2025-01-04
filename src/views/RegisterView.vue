<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4 text-gray-800 text-center">Register</h2>
      <form @submit.prevent="handleRegister">

        <!-- File Input -->
        <div class="mb-4">
          <div class="flex items-center justify-center w-full">
            <label
              for="dropzone-file"
              class="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-300"
            >
              <div
                class="flex flex-col items-center justify-center pt-4 pb-4"
                v-if="!imagePreview"
              >
                <svg
                  class="w-8 h-8 mb-2 text-gray-600"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p class="mb-1 text-sm text-gray-600">
                  <span class="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p class="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>

              <!-- Image Preview -->
              <div v-if="imagePreview" class="flex items-center justify-center">
                <img
                  :src="imagePreview"
                  alt="Uploaded Image"
                  class="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
                />
              </div>

              <input
                id="dropzone-file"
                type="file"
                class="hidden"
                accept="image/*"
                @change="handleFileUpload"
              />
            </label>
          </div>
        </div>

        <!-- Username -->
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 border rounded-lg text-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full px-3 py-2 border rounded-lg text-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Password -->
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="mt-1 block w-full px-3 py-2 border rounded-lg text-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Commune -->
        <div class="mb-4">
          <label for="commune" class="block text-sm font-medium text-gray-700">Commune</label>
          <select
            id="commune"
            v-model="commune"
            required
            class="mt-1 block w-full px-3 py-2 border rounded-lg text-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Select your commune</option>
            <option v-for="item in communes" :key="item.id" :value="item.id">
              {{ item.name_full }}
            </option>
          </select>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring focus:ring-green-500 focus:ring-opacity-50"
        >
          <span v-if="loading">Registering...</span>
          <span v-else>Register</span>
        </button>
      </form>

      <!-- Error/Success Messages -->
      <p v-if="error" class="mt-4 text-sm text-center text-red-600">{{ error }}</p>
      <p v-if="successMessage" class="mt-4 text-sm text-center text-green-600">{{ successMessage }}</p>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const image = ref(null);
const username = ref('');
const email = ref('');
const password = ref('');
const commune = ref('');
const communes = ref([]);
const loading = ref(false);
const error = ref('');
const successMessage = ref('');
const imagePreview = ref(null);
const router = useRouter();

// Fetch communes data from the API
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8000/security/communes/');
    communes.value = response.data.map((item) => ({
      id: item.id,
      name_full: item.name_full,
    }));
  } catch (err) {
    console.error('Error fetching communes:', err);
    error.value = 'Failed to load communes. Please try again later.';
  }
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    imagePreview.value = URL.createObjectURL(file); // Create image preview
    image.value = file;
  } else {
    alert('Please upload a valid image file.');
    imagePreview.value = null;
  }
};

// Handle user registration
const handleRegister = async () => {
  if (!commune.value) {
    error.value = 'Commune selection is mandatory.';
    return;
  }

  loading.value = true;
  error.value = '';
  successMessage.value = '';

  // Create a FormData object to include the image
  const formData = new FormData();
  formData.append('username', username.value);
  formData.append('email', email.value);
  formData.append('password', password.value);
  formData.append('commune', commune.value);

  // Add the image file if it exists
  if (image.value) {
    formData.append('image', image.value);
  }

  try {
    const response = await axios.post('http://localhost:8000/auth/register/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure the request is sent as multipart/form-data
      },
    });

    successMessage.value = response.data.message;
    setTimeout(() => router.push('/login'), 3000); // Redirect to login after 3 seconds
  } catch (err) {
    console.error('Registration error:', err);
    error.value =
      err.response?.data?.errors || 'An error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
