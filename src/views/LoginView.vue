<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4 text-gray-800 text-center">Login</h2>
        <form @submit.prevent="handleLogin">
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
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="mt-1 block w-full px-3 py-2 border rounded-lg text-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          >
            <span v-if="loading">Logging in...</span>
            <span v-else>Login</span>
          </button>
        </form>
        <p v-if="error" class="mt-4 text-sm text-center text-red-600">{{ error }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { login } from '@/api/auth';
  
  const username = ref('');
  const password = ref('');
  const loading = ref(false);
  const error = ref('');
  const router = useRouter();
  
  const handleLogin = async () => {
    loading.value = true;
    error.value = '';
  
    try {
      const { access } = await login(username.value, password.value);
      localStorage.setItem('authToken', access);
      router.push('/'); // Redirect to the main page
    } catch (err) {
      console.error('Login error:', err);
      error.value = 'Invalid username or password. Please try again.';
    } finally {
      loading.value = false;
    }
  };
  </script>
  