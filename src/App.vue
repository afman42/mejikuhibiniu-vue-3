<template>
  <div
    class="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex flex-col justify-center items-center p-2 sm:p-4"
  >
    <div
      class="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-cyan-100 overflow-hidden"
    >
      <!-- Header section -->
      <div class="bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 sm:p-6">
        <div
          class="flex flex-col sm:flex-row justify-between items-center gap-3"
        >
          <h1
            class="text-3xl sm:text-base md:text-4xl font-bold text-black drop-shadow-lg text-center"
          >
            Mejikuhibiniu
          </h1>
          <SoundControls />
        </div>
      </div>

      <!-- Main content -->
      <div class="px-4 py-2 sm:p-5 md:p-6">
        <!-- Difficulty selector -->
        <div class="mb-4 sm:mb-6">
          <DifficultySelector
            :selected-difficulty="state.difficulty"
            @difficulty-change="setDifficulty"
          />
        </div>

        <!-- Game status -->
        <div class="mb-4 sm:mb-6 text-center py-3 sm:py-4 shadow-sm">
          <p
            v-if="state.isMemorizing"
            class="text-cyan-600 font-semibold text-base sm:text-lg"
          >
            🧠 Ingat urutan angka berwarna di atas! Waktu akan mulai ketika kamu
            menekan Play.
          </p>
          <p
            v-else-if="state.isPlaying && state.timerSecond > 0"
            class="text-green-600 font-semibold text-base sm:text-lg"
          >
            ⏱️ Waktu mulai! Ingat baik-baik. ({{ state.timerSecond }}s)
          </p>
          <p
            v-else-if="state.timerSecond === 0 && !state.gameResult.bool"
            class="text-amber-600 font-semibold text-base sm:text-lg"
          >
            ✅ Waktu habis! Sekarang susun kembali angka dalam urutan yang
            benar.
          </p>
          <p
            v-else-if="state.gameResult.bool"
            class="text-xl sm:text-2xl font-bold py-2"
            :class="
              state.gameResult.result === 'Menang'
                ? 'text-green-600'
                : 'text-red-600'
            "
          >
            {{ state.gameResult.result === "Menang" ? "🎉" : "😔" }}
            {{ state.gameResult.result }}
          </p>
        </div>

        <!-- Original sequence display for memorization -->
        <div
          v-if="state.timerSecond > 0 || state.gameResult.bool"
          class="mb-5 sm:mb-7"
        >
          <div
            class="flex flex-col sm:flex-row justify-between items-center mb-2 sm:mb-3 gap-2"
          >
            <h2
              class="text-lg sm:text-xl font-bold text-gray-800 text-center sm:text-left"
            >
              Urutan Asli:
            </h2>
            <div
              class="text-xs sm:text-sm font-medium text-cyan-700 bg-cyan-100 px-2 sm:px-3 py-1 rounded-full"
            >
              {{ state.originalSequence.length }} angka
            </div>
          </div>
          <div class="flex justify-center">
            <SequenceDisplay
              :sequence="state.originalSequence"
              :show-original-colors="
                state.timerSecond > 0 || state.gameResult.bool
              "
            />
          </div>
        </div>

        <!-- Shuffled number grid for selection -->
        <div class="mb-5 sm:mb-7">
          <h2
            class="text-lg sm:text-xl font-bold text-center text-gray-800 mb-2 sm:mb-3"
          >
            Pilih Angka:
          </h2>
          <div class="flex justify-center">
            <NumberGrid
              :numbers="state.displaySequence"
              :disabled="
                state.isMemorizing ||
                (state.isPlaying && state.timerSecond > 0) ||
                state.gameResult.bool
              "
              :selected-items="state.playerSequence.map((item) => item.name)"
              :show-original-colors="
                state.gameResult.bool ||
                !state.isPlaying ||
                state.timerSecond > 0
              "
              @select="selectNumber"
            />
          </div>
        </div>

        <!-- Player's sequence -->
        <div class="mb-5 sm:mb-7">
          <h2
            class="text-lg sm:text-xl font-bold text-center text-gray-800 mb-2 sm:mb-3"
          >
            Jawaban Anda:
          </h2>
          <div class="flex justify-center">
            <PlayerSequence
              :sequence="state.playerSequence"
              :disabled="state.gameResult.bool"
              :show-original-colors="state.gameResult.bool"
              @remove="removeNumber"
            />
          </div>
        </div>

        <!-- Game controls -->
        <div class="mb-5 sm:mb-7">
          <GameControls
            :timer="state.timerSecond"
            :is-playing="state.isPlaying"
            :game-result="state.gameResult"
            :player-sequence-length="state.playerSequence.length"
            :original-sequence-length="state.originalSequence.length"
            @play="startTimer"
            @reset="resetGame"
            @result="checkResult"
          />
        </div>

        <!-- Game history -->
        <GameHistory />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useGame } from "./composables/useGame";
import SequenceDisplay from "./components/SequenceDisplay.vue";
import NumberGrid from "./components/NumberGrid.vue";
import PlayerSequence from "./components/PlayerSequence.vue";
import GameControls from "./components/GameControls.vue";
import DifficultySelector from "./components/DifficultySelector.vue";
import SoundControls from "./components/SoundControls.vue";
import GameHistory from "./components/GameHistory.vue";

const {
  state,
  initializeGame,
  shuffleArray,
  startTimer,
  resetGame,
  checkResult,
  selectNumber,
  removeNumber,
  setDifficulty,
} = useGame();

// Initialize the game when component mounts
onMounted(() => {
  initializeGame();
  shuffleArray();
});
</script>
