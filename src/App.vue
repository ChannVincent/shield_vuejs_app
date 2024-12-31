<template>
  <div class="flex flex-col min-h-screen font-Roboto bg-gray-100">
    <RouterView />
    <!-- Install Prompt -->
    <div v-if="showInstallPrompt" class="fixed bottom-4 right-4 bg-white shadow-lg rounded-md p-4 flex items-center space-x-4">
      <p class="text-gray-700">Install this app on your device?</p>
      <button
        @click="handleInstall"
        class="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
      >
        Install
      </button>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue';

const installPromptEvent = ref(null);
const showInstallPrompt = ref(false);

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (event) => {
    // Prevent the default install prompt
    event.preventDefault();

    // Save the event for triggering later
    installPromptEvent.value = event;

    // Show your custom prompt UI
    showInstallPrompt.value = true;
  });
});

const handleInstall = () => {
  if (installPromptEvent.value) {
    // Show the install prompt
    installPromptEvent.value.prompt();

    // Wait for the user's response
    installPromptEvent.value.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }

      // Reset the prompt state
      installPromptEvent.value = null;
      showInstallPrompt.value = false;
    });
  }
};

</script>

<style scoped>
.fixed {
  position: fixed;
}

.bottom-4 {
  bottom: 1rem;
}

.right-4 {
  right: 1rem;
}

.shadow-lg {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.rounded-md {
  border-radius: 0.375rem;
}
</style>