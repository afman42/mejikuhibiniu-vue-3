<template>
  <div class="difficulty-selector mb-4 sm:mb-6">
    <label
      class="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3"
      >Tingkat Kesulitan:</label
    >
    <div
      class="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 justify-center"
    >
      <button
        v-for="(level, key) in GAME_CONFIG.DIFFICULTY_LEVELS"
        :key="key"
        :class="[
          'px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base font-bold transition-all duration-300 flex flex-col items-center justify-center min-w-[100px] sm:min-w-[120px] h-auto',
          selectedDifficulty === key
            ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg transform scale-105'
            : 'bg-white text-gray-800 hover:shadow-md hover:shadow-cyan-100',
        ]"
        @click="$emit('difficulty-change', key)"
        :aria-pressed="selectedDifficulty === key"
        :aria-label="`Pilih kesulitan ${level.name}`"
      >
        <span class="text-lg sm:text-xl mb-1">
          {{ key === "EASY" ? "😊" : key === "MEDIUM" ? "😏" : "😎" }}
        </span>
        <span class="text-xs sm:text-sm sm:text-base">{{ level.name }}</span>
      </button>
    </div>
    <div class="text-center mt-2 sm:mt-3">
      <p class="text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 inline-block">
        {{ getDifficultyDescription(selectedDifficulty) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GAME_CONFIG } from "../constants";

interface Props {
  selectedDifficulty: keyof typeof GAME_CONFIG.DIFFICULTY_LEVELS;
}

interface Emits {
  (
    e: "difficulty-change",
    difficulty: keyof typeof GAME_CONFIG.DIFFICULTY_LEVELS,
  ): void;
}

defineProps<Props>();
defineEmits<Emits>();

const getDifficultyDescription = (
  difficulty: keyof typeof GAME_CONFIG.DIFFICULTY_LEVELS,
) => {
  const level = GAME_CONFIG.DIFFICULTY_LEVELS[difficulty];
  return `${level.sequenceLength} angka • ${level.timerSeconds} detik • ${level.name}`;
};
</script>
