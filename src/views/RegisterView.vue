<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4 text-gray-800 text-center">Register</h2>
      <form @submit.prevent="handleRegister">
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
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring focus:ring-green-500 focus:ring-opacity-50"
        >
          <span v-if="loading">Registering...</span>
          <span v-else>Register</span>
        </button>
      </form>
      <p v-if="error" class="mt-4 text-sm text-center text-red-600">{{ error }}</p>
      <p v-if="successMessage" class="mt-4 text-sm text-center text-green-600">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const username = ref('');
const email = ref('');
const password = ref('');
const commune = ref('');
const communes = ref([]);
const loading = ref(false);
const error = ref('');
const successMessage = ref('');
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

// Handle user registration
const handleRegister = async () => {
  if (!commune.value) {
    error.value = 'Commune selection is mandatory.';
    return;
  }

  loading.value = true;
  error.value = '';
  successMessage.value = '';

  try {
    const response = await axios.post('http://localhost:8000/auth/register/', {
      username: username.value,
      email: email.value,
      password: password.value,
      commune: commune.value,
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
