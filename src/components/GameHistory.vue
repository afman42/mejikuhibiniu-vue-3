<template>
  <div class="game-history bg-gray-50 rounded-lg p-4 mt-4">
    <div class="flex justify-between items-center mb-3">
      <h3 class="font-semibold text-gray-800">Riwayat Permainan</h3>
      <button 
        @click="clearHistory" 
        class="text-xs text-red-500 hover:text-red-700"
        aria-label="Hapus riwayat permainan"
      >
        Hapus
      </button>
    </div>
    
    <div class="text-sm mb-3">
      <span class="text-gray-600">Total: {{ stats.totalGames }} | </span>
      <span class="text-green-600">Menang: {{ stats.wins }} | </span>
      <span class="text-red-600">Kalah: {{ stats.losses }} | </span>
      <span :class="stats.winRate >= 50 ? 'text-green-600' : 'text-red-600'">
        Rasio: {{ stats.winRate }}%
      </span>
    </div>
    
    <div v-if="history.length === 0" class="text-sm text-gray-500 italic">
      Belum ada riwayat permainan
    </div>
    
    <div v-else class="space-y-2 max-h-60 overflow-y-auto">
      <div 
        v-for="entry in history" 
        :key="entry.id"
        :class="[
          'p-2 rounded text-sm flex justify-between items-center',
          entry.won ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        ]"
      >
        <div>
          <span :class="entry.won ? 'text-green-700 font-medium' : 'text-red-700 font-medium'">
            {{ entry.won ? 'Menang' : 'Kalah' }}
          </span>
          <span class="text-gray-500 ml-2">• {{ entry.difficulty }}</span>
        </div>
        <div class="text-gray-500 text-xs">
          {{ formatDate(entry.date) }} | {{ entry.timeTaken }}s
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { gameHistoryService, GameHistoryEntry } from '../services/gameHistoryService';

// Initialize with current history
const history = ref<GameHistoryEntry[]>([]);

// Stats computed from history
const stats = computed(() => {
  return gameHistoryService.getStats();
});

const loadHistory = () => {
  history.value = gameHistoryService.getHistory();
};

const clearHistory = () => {
  gameHistoryService.clearHistory();
  loadHistory();
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Load initial history
onMounted(() => {
  loadHistory();
  
  // Watch for changes in localStorage by polling (in a real app, we might use StorageEvent)
  const interval = setInterval(() => {
    const currentHistory = gameHistoryService.getHistory();
    if (currentHistory.length !== history.value.length) {
      loadHistory();
    }
  }, 1000);
  
  // Clean up interval on component unmount
  onUnmounted(() => {
    clearInterval(interval);
  });
});
</script>