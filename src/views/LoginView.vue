<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4 text-gray-800 text-center">Login</h2>
        <form @submit.prevent="handleLogin">
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
        <p class="mt-4 text-sm text-center text-gray-600">
          Don't have an account?
          <a href="/register" class="text-blue-600 hover:underline">Register here</a>.
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const email = ref('');
  const password = ref('');
  const loading = ref(false);
  
  const handleLogin = async () => {
    loading.value = true;
    try {
      // Simulate login API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated delay
      alert('Login successful!');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Failed to login. Please try again.');
    } finally {
      loading.value = false;
    }
  };
  </script>
  