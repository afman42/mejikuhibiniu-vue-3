<template>
  <div class="game-controls flex flex-col items-center gap-3 sm:gap-4 mb-4">
    <div
      class="timer text-lg sm:text-xl font-bold bg-gray-100 py-2 px-3 sm:px-4 rounded-lg"
    >
      Waktu: {{ timer === 0 ? timer : timer + "s" }}
    </div>

    <div
      class="button-group flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap justify-center w-full max-w-xs"
    >
      <button
        @click="onPlay"
        :disabled="isPlaying || gameResult.bool"
        :class="[
          'py-2 px-4 sm:py-3 sm:px-6 rounded-lg font-bold transition-all min-w-[80px] sm:min-w-[100px] text-sm sm:text-base',
          isPlaying || gameResult.bool
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white active:bg-blue-700',
        ]"
        aria-label="Mulai permainan"
      >
        Play
      </button>

      <button
        @click="onReset"
        :disabled="!isPlaying"
        :class="[
          'py-2 px-4 sm:py-3 sm:px-6  rounded-lg font-bold transition-all min-w-[80px] sm:min-w-[100px] text-sm sm:text-base active:bg-gray-700',
          !isPlaying
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gray-500 hover:bg-gray-600 text-white',
        ]"
        aria-label="Ulangi permainan"
      >
        Reset
      </button>

      <button
        v-if="showResultButton"
        @click="onResult"
        class="py-2 px-4 sm:py-3 sm:px-6 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-all min-w-[80px] sm:min-w-[100px] text-sm sm:text-base active:bg-green-700"
        aria-label="Lihat hasil"
      >
        Result
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  timer: number;
  isPlaying: boolean;
  gameResult: { bool: boolean };
  playerSequenceLength: number;
  originalSequenceLength: number;
}

interface Emits {
  (e: "play"): void;
  (e: "reset"): void;
  (e: "result"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const showResultButton = computed(() => {
  return (
    props.playerSequenceLength === props.originalSequenceLength &&
    !props.gameResult.bool
  );
});

const onPlay = () => emit("play");
const onReset = () => emit("reset");
const onResult = () => emit("result");
</script>
