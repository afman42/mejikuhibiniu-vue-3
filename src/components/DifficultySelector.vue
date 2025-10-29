<template>
  <div class="difficulty-selector mb-6">
    <label class="block text-lg font-semibold text-gray-800 mb-3">Tingkat Kesulitan:</label>
    <div class="flex flex-wrap gap-3 justify-center">
      <button
        v-for="(level, key) in GAME_CONFIG.DIFFICULTY_LEVELS"
        :key="key"
        :class="[
          'px-6 py-3 rounded-xl text-base font-bold transition-all duration-300 flex flex-col items-center justify-center min-w-[120px] h-auto border-2',
          selectedDifficulty === key
            ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-200 transform scale-105'
            : 'bg-white text-gray-800 border-cyan-200 hover:border-cyan-400 hover:shadow-md hover:shadow-cyan-100'
        ]"
        @click="$emit('difficulty-change', key)"
        :aria-pressed="selectedDifficulty === key"
        :aria-label="`Pilih kesulitan ${level.name}`"
      >
        <span class="text-xl mb-1">
          {{ key === 'EASY' ? '😊' : key === 'MEDIUM' ? '😏' : '😎' }}
        </span>
        <span>{{ level.name }}</span>
      </button>
    </div>
    <div class="text-center mt-3">
      <p class="text-sm font-medium text-cyan-700 bg-cyan-50 rounded-lg py-2 px-4 inline-block border border-cyan-200">
        {{ getDifficultyDescription(selectedDifficulty) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GAME_CONFIG } from '../constants';

interface Props {
  selectedDifficulty: keyof typeof GAME_CONFIG.DIFFICULTY_LEVELS;
}

interface Emits {
  (e: 'difficulty-change', difficulty: keyof typeof GAME_CONFIG.DIFFICULTY_LEVELS): void;
}

defineProps<Props>();
defineEmits<Emits>();

const getDifficultyDescription = (difficulty: keyof typeof GAME_CONFIG.DIFFICULTY_LEVELS) => {
  const level = GAME_CONFIG.DIFFICULTY_LEVELS[difficulty];
  return `${level.sequenceLength} angka • ${level.timerSeconds} detik • ${level.name}`;
};
</script>