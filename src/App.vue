<script setup lang="ts">
import { createInitialColorsRandom, IColorRandom } from "./data";
import { ref, onMounted } from "vue";

// Game state
const originalSequence = ref<IColorRandom[]>([]);
const displaySequence = ref<IColorRandom[]>([]);
const playerSequence = ref<IColorRandom[]>([]);
const gameResult = ref<{ result: string; bool: boolean }>({
  result: "",
  bool: false,
});
const isMemorizing = ref<boolean>(true); // true means player is viewing the original sequence
const isPlaying = ref<boolean>(false); // true means the game is active (timer running)
const timerSecond = ref<number>(10);
const timerId = ref<number | null>(null); // Store timer ID to be able to clear it

// Initialize the game with a new sequence
function initializeGame() {
  originalSequence.value = createInitialColorsRandom();
  displaySequence.value = [...originalSequence.value]; // Copy for shuffling
  playerSequence.value = [];
  gameResult.value = { result: "", bool: false };
  isMemorizing.value = true;
  isPlaying.value = false;
  timerSecond.value = 10;
}

// Shuffle the display sequence
function shuffleArray() {
  displaySequence.value = [...originalSequence.value] // Create a copy to avoid modifying original
    .map((item: IColorRandom) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }: { item: IColorRandom }) => item);
}

// Start the game timer
function play() {
  isPlaying.value = true;
  isMemorizing.value = false;
  
  // Clear any existing timer
  if (timerId.value) {
    clearInterval(timerId.value);
  }
  
  // Start new timer
  timerId.value = window.setInterval(frame, 1000);
  
  function frame() {
    if (timerSecond.value <= 0) {
      timerSecond.value = 0;
      if (timerId.value) {
        clearInterval(timerId.value);
        timerId.value = null;
      }
      // Don't change isMemorizing here - we want to allow interaction after timer ends
    } else {
      timerSecond.value--;
    }
  }
}

// Reset the game
function reset() {
  if (timerId.value) {
    clearInterval(timerId.value);
    timerId.value = null;
  }
  
  initializeGame();
  shuffleArray(); // Shuffle the sequence for the new game
}

// Check player's result
function result() {
  // Compare sequences properly - make sure both arrays have the same order and values
  const isCorrect = originalSequence.value.length === playerSequence.value.length &&
    originalSequence.value.every((item, index) => 
      item.name === playerSequence.value[index].name &&
      item.nbr === playerSequence.value[index].nbr &&
      item.color === playerSequence.value[index].color
    );
  
  if (isCorrect) {
    gameResult.value.result = "Menang";
  } else {
    gameResult.value.result = "Kalah";
  }
  
  gameResult.value.bool = true;
  isMemorizing.value = false;
  
  // Stop the timer when result is shown
  if (timerId.value) {
    clearInterval(timerId.value);
    timerId.value = null;
  }
}

// Handle player clicking on a number
function clickDiv(numberRandom: IColorRandom) {
  if (isPlaying.value && timerSecond.value === 0 && !gameResult.value.bool) {
    // Check if this item is already in the player's sequence
    const isAlreadySelected = playerSequence.value
      .some(item => item.name === numberRandom.name);
    
    if (!isAlreadySelected && playerSequence.value.length < originalSequence.value.length) {
      playerSequence.value.push({ ...numberRandom }); // Add a copy of the item
    }
  }
}

// Remove an item from player's sequence
function removeObjectInArray(name: string) {
  if (gameResult.value.bool) {
    return; // Don't allow changes after result is shown
  }
  playerSequence.value = playerSequence.value.filter(
    (item: IColorRandom) => item.name !== name
  );
}

// Initialize the game when component mounts
onMounted(() => {
  initializeGame();
  shuffleArray();
});
</script>

<template>
  <div class="min-h-screen flex flex-col justify-center items-center">
    <h2>
      <span
        v-for="itemColor in originalSequence"
        :class="itemColor.color"
        :key="'original-' + itemColor.name"
        >{{ itemColor.name }}</span
      >
    </h2>
    <span class="mb-2"
      >Urutkan angka warna
      <span
        v-for="itemColor in originalSequence"
        :class="itemColor.color"
        :key="'original-label-' + itemColor.name"
        >{{ itemColor.name }}</span
      >
      dengan klik angkanya</span
    >
    <span v-if="gameResult.bool" class="mb-2 text-xl font-bold">{{ gameResult.result }}</span>
    <div class="flex flex-row mb-2">
      <div
        class="mr-2 cursor-pointer text-2xl font-bold"
        :class="[isMemorizing ? 'text-black' : item.color]"
        :key="'display-' + item.name"
        v-for="item in displaySequence"
        @click="clickDiv(item)"
      >
        {{ item.nbr }}
      </div>
    </div>
    <p class="mb-2" v-if="playerSequence.length">Jawaban Anda</p>
    <div class="flex flex-row mb-2" v-if="playerSequence.length">
      <div
        class="mr-2 cursor-pointer text-2xl font-bold"
        :class="[isMemorizing ? 'text-black' : item.color]"
        :key="'player-' + item.name"
        v-for="item in playerSequence"
        @click="removeObjectInArray(item.name)"
      >
        {{ item.nbr }}
      </div>
    </div>
    <transition name="no-item-opacity">
      <div v-if="gameResult.bool">
        <p style="text-align: center">Samakan</p>
        <div class="flex flex-row mb-2">
          <div
            class="mr-2"
            :class="item.color"
            :key="'result-' + item.name"
            v-for="item in originalSequence"
          >
            {{ item.nbr }}
          </div>
        </div>
      </div>
    </transition>
    <div class="flex flex-row items-center">
      <div class="mr-4 text-lg">
        Waktu: {{ timerSecond == 0 ? timerSecond : timerSecond + "s" }}
      </div>
      <div class="flex space-x-2">
        <button 
          @click="play" 
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50" 
          :disabled="isPlaying"
        >
          Play
        </button>
        <button 
          @click="reset" 
          class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
        <button
          v-if="playerSequence.length === originalSequence.length && !gameResult.bool"
          @click="result"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Result
        </button>
      </div>
    </div>
  </div>
</template>
