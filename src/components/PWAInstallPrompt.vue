<template>
  <transition name="slide-up">
    <div 
      v-if="showInstallPrompt" 
      class="pwa-install-prompt fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-64 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50"
    >
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <img src="/vite.svg" alt="App Icon" class="w-12 h-12 rounded-lg">
        </div>
        <div class="ml-3 flex-1">
          <h3 class="text-lg font-semibold text-gray-900">Install Mejikuhibiniu</h3>
          <p class="mt-1 text-sm text-gray-600">Add to your home screen for quick access and offline play.</p>
          <div class="mt-3 flex space-x-3">
            <button
              @click="cancelInstall"
              class="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Not now
            </button>
            <button
              @click="installPWA"
              class="px-4 py-2 text-sm font-medium text-white bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Install
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { pwaService } from '../services/pwaService';

const showInstallPrompt = ref(false);

const installPWA = async () => {
  showInstallPrompt.value = false;
  const success = await pwaService.install();
  if (success) {
    console.log('PWA installed successfully');
  }
};

const cancelInstall = () => {
  showInstallPrompt.value = false;
  // Store user preference to not show again for a period
  localStorage.setItem('pwaInstallDeclined', Date.now().toString());
};

// Check if user has declined install recently (24 hours)
const shouldShowPrompt = () => {
  const lastDeclined = localStorage.getItem('pwaInstallDeclined');
  if (!lastDeclined) return true;
  
  const hoursSinceDeclined = (Date.now() - parseInt(lastDeclined)) / (1000 * 60 * 60);
  return hoursSinceDeclined > 24;
};

onMounted(() => {
  // Show install prompt after a delay if installable and user hasn't declined recently
  setTimeout(() => {
    if (pwaService.isInstallable() && shouldShowPrompt()) {
      showInstallPrompt.value = true;
    }
  }, 5000); // Show after 5 seconds (to not interrupt initial experience)
});

onUnmounted(() => {
  // Clean up if needed
});
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>