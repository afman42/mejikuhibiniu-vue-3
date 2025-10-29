<template>
  <div class="game-history bg-gray-50 rounded-lg p-3 sm:p-4 mt-4">
    <div class="flex flex-col sm:flex-row justify-between items-center mb-2 sm:mb-3 gap-2">
      <h3 class="font-semibold text-gray-800 text-sm sm:text-base">Riwayat Permainan</h3>
      <button 
        @click="clearHistory" 
        class="text-xs text-red-500 hover:text-red-700"
        aria-label="Hapus riwayat permainan"
      >
        Hapus
      </button>
    </div>
    
    <div class="text-xs sm:text-sm mb-2 sm:mb-3">
      <span class="text-gray-600 block sm:inline">Total: {{ stats.totalGames }} | </span>
      <span class="text-green-600 block sm:inline">Menang: {{ stats.wins }} | </span>
      <span class="text-red-600 block sm:inline">Kalah: {{ stats.losses }} | </span>
      <span :class="stats.winRate >= 50 ? 'text-green-600' : 'text-red-600'">
        Rasio: {{ stats.winRate }}%
      </span>
    </div>
    
    <div v-if="history.length === 0" class="text-xs sm:text-sm text-gray-500 italic">
      Belum ada riwayat permainan
    </div>
    
    <div v-else class="space-y-2 max-h-48 sm:max-h-60 overflow-y-auto">
      <div 
        v-for="entry in history" 
        :key="entry.id"
        :class="[
          'p-2 rounded text-xs sm:text-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1',
          entry.won ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        ]"
      >
        <div>
          <span :class="entry.won ? 'text-green-700 font-medium' : 'text-red-700 font-medium'">
            {{ entry.won ? 'Menang' : 'Kalah' }}
          </span>
          <span class="text-gray-500 ml-2">• {{ entry.difficulty }}</span>
        </div>
        <div class="text-gray-500 text-xs w-full sm:w-auto text-right">
          {{ formatDate(entry.date) }} | {{ entry.timeTaken }}s
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { gameHistoryService, GameHistoryEntry } from '../services/gameHistoryService';

// Initialize with current history
const history = ref<GameHistoryEntry[]>([]);

// Load initial history
const loadHistory = () => {
  history.value = gameHistoryService.getHistory();
};

// Stats computed from history - we'll make this reactive to history changes
const stats = computed(() => {
  return gameHistoryService.getStats();
});

const clearHistory = () => {
  gameHistoryService.clearHistory();
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Load initial history
onMounted(() => {
  loadHistory();
  
  // Subscribe to changes in the game history service
  const unsubscribe = gameHistoryService.subscribe(() => {
    loadHistory();
  });
  
  // Also listen for storage events (for cross-tab updates)
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'mejikuhibiniu_game_history') {
      loadHistory();
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  
  // Cleanup
  onUnmounted(() => {
    unsubscribe();
    window.removeEventListener('storage', handleStorageChange);
  });
});
</script>