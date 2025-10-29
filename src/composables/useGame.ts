import { ref, onUnmounted } from 'vue';
import { createInitialColorsRandom, IColorRandom } from '../data';
import { GAME_CONFIG } from '../constants';
import { soundService } from '../services/soundService';
import { gameHistoryService } from '../services/gameHistoryService';

export interface GameResult {
  result: string;
  bool: boolean;
}

export interface GameState {
  originalSequence: IColorRandom[];
  displaySequence: IColorRandom[];
  playerSequence: IColorRandom[];
  gameResult: GameResult;
  isMemorizing: boolean;
  isPlaying: boolean;
  timerSecond: number;
  timerId: number | null;
  difficulty: keyof typeof GAME_CONFIG.DIFFICULTY_LEVELS;
  startTime: number | null; // Track when the player starts the selection phase
  totalSelectionTime: number; // Total time taken to complete the sequence
}

export const useGame = () => {
  // Game state
  const state = ref<GameState>({
    originalSequence: [],
    displaySequence: [],
    playerSequence: [],
    gameResult: { result: "", bool: false },
    isMemorizing: true, // true means player is viewing the original sequence
    isPlaying: false, // true means the game is active (timer running)
    timerSecond: GAME_CONFIG.DEFAULT_TIMER,
    timerId: null,
    difficulty: 'MEDIUM', // default difficulty
    startTime: null, // Will be set when timer ends and selection begins
    totalSelectionTime: 0 // Time taken to complete the sequence
  });

  // Initialize the game with a new sequence based on difficulty
  const initializeGame = () => {
    const fullSequence = createInitialColorsRandom();
    const sequenceLength = GAME_CONFIG.DIFFICULTY_LEVELS[state.value.difficulty].sequenceLength;
    
    state.value.originalSequence = fullSequence.slice(0, sequenceLength);
    state.value.displaySequence = [...state.value.originalSequence]; // Copy for shuffling
    state.value.playerSequence = [];
    state.value.gameResult = { result: "", bool: false };
    state.value.isMemorizing = true;
    state.value.isPlaying = false;
    state.value.timerSecond = GAME_CONFIG.DIFFICULTY_LEVELS[state.value.difficulty].timerSeconds;
    state.value.startTime = null;
    state.value.totalSelectionTime = 0;
  };

  // Shuffle the display sequence
  const shuffleArray = () => {
    state.value.displaySequence = [...state.value.originalSequence] // Create a copy to avoid modifying original
      .map((item: IColorRandom) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }: { item: IColorRandom }) => item);
  };

  // Start the game timer
  const startTimer = () => {
    state.value.isPlaying = true;
    state.value.isMemorizing = false;
    
    // Clear any existing timer
    if (state.value.timerId) {
      clearInterval(state.value.timerId);
    }
    
    // Start new timer
    state.value.timerId = window.setInterval(() => {
      if (state.value.timerSecond <= 0) {
        state.value.timerSecond = 0;
        if (state.value.timerId) {
          clearInterval(state.value.timerId);
          state.value.timerId = null;
        }
        // When timer ends, selection phase begins
        state.value.startTime = Date.now();
      } else {
        state.value.timerSecond--;
      }
    }, 1000);
    
    soundService.playStartSound();
  };

  // Stop the timer
  const stopTimer = () => {
    if (state.value.timerId) {
      clearInterval(state.value.timerId);
      state.value.timerId = null;
    }
  };

  // Reset the game
  const resetGame = () => {
    stopTimer();
    initializeGame();
    shuffleArray(); // Shuffle the sequence for the new game
  };

  // Change difficulty level
  const setDifficulty = (difficulty: keyof typeof GAME_CONFIG.DIFFICULTY_LEVELS) => {
    const wasPlaying = state.value.isPlaying;
    const wasMemorizing = state.value.isMemorizing;
    const wasGameResult = state.value.gameResult.bool;
    const wasTimerRunning = state.value.timerSecond > 0 && state.value.isPlaying;
    
    state.value.difficulty = difficulty;
    
    // Update timer according to new difficulty
    state.value.timerSecond = GAME_CONFIG.DIFFICULTY_LEVELS[difficulty].timerSeconds;
    
    // Regenerate the game sequence with the new difficulty
    // but preserve the current game state
    const newSequence = createInitialColorsRandom();
    const sequenceLength = GAME_CONFIG.DIFFICULTY_LEVELS[difficulty].sequenceLength;
    
    state.value.originalSequence = newSequence.slice(0, sequenceLength);
    state.value.displaySequence = [...state.value.originalSequence]; // Copy for shuffling
    state.value.playerSequence = []; // Clear player sequence when difficulty changes
    
    // Preserve the current state (memorizing, playing, etc.)
    if (wasMemorizing) {
      state.value.isMemorizing = true;
      state.value.isPlaying = false;
    } else if (wasPlaying && !wasGameResult) {
      state.value.isMemorizing = false;
      state.value.isPlaying = true;
    } else if (wasGameResult) {
      // If there was a game result, we need to reset but preserve the result state
      state.value.isMemorizing = false;
      state.value.isPlaying = false;
      state.value.gameResult = { result: state.value.gameResult.result, bool: true };
    } else {
      // Default to memorizing state
      state.value.isMemorizing = true;
      state.value.isPlaying = false;
    }
    
    // Shuffle the display sequence for the new difficulty
    shuffleArray();
    
    // If the game was in progress and timer was running, stop the old timer
    if (wasTimerRunning) {
      stopTimer();
    }
  };

  // Check player's result
  const checkResult = () => {
    // Calculate total time taken if we have a start time
    if (state.value.startTime) {
      state.value.totalSelectionTime = Math.round((Date.now() - state.value.startTime) / 1000); // in seconds
    }
    
    // Compare sequences properly - make sure both arrays have the same order and values
    const isCorrect = state.value.originalSequence.length === state.value.playerSequence.length &&
      state.value.originalSequence.every((item, index) => 
        item.name === state.value.playerSequence[index].name &&
        item.nbr === state.value.playerSequence[index].nbr &&
        item.color === state.value.playerSequence[index].color
      );
    
    if (isCorrect) {
      state.value.gameResult = { result: "Menang", bool: true };
      soundService.playWinSound();
    } else {
      state.value.gameResult = { result: "Kalah", bool: true };
      soundService.playLoseSound();
    }
    
    state.value.isMemorizing = false;
    
    // Stop the timer when result is shown
    stopTimer();
    
    // Save to game history
    if (state.value.originalSequence.length > 0) {
      gameHistoryService.addEntry({
        date: new Date(),
        difficulty: GAME_CONFIG.DIFFICULTY_LEVELS[state.value.difficulty].name,
        won: isCorrect,
        sequenceLength: state.value.originalSequence.length,
        timeTaken: state.value.totalSelectionTime,
        attempts: state.value.playerSequence.length
      });
    }
  };

  // Handle player clicking on a number
  const selectNumber = (numberRandom: IColorRandom) => {
    if (state.value.isPlaying && state.value.timerSecond === 0 && !state.value.gameResult.bool) {
      // Check if this item is already in the player's sequence
      const isAlreadySelected = state.value.playerSequence
        .some(item => item.name === numberRandom.name);
      
      if (!isAlreadySelected && state.value.playerSequence.length < state.value.originalSequence.length) {
        state.value.playerSequence.push({ ...numberRandom }); // Add a copy of the item
        soundService.playSelectSound();
      }
    }
  };

  // Remove an item from player's sequence
  const removeNumber = (name: string) => {
    if (state.value.gameResult.bool) {
      return; // Don't allow changes after result is shown
    }
    state.value.playerSequence = state.value.playerSequence.filter(
      (item: IColorRandom) => item.name !== name
    );
    soundService.playRemoveSound();
  };

  // Safe cleanup - only call onUnmounted if in a component setup context
  try {
    onUnmounted(() => {
      stopTimer();
    });
  } catch (e) {
    // If onUnmounted is called outside a component context (in tests), just ensure cleanup function is available
  }

  return {
    state,
    initializeGame,
    shuffleArray,
    startTimer,
    stopTimer,
    resetGame,
    checkResult,
    selectNumber,
    removeNumber,
    setDifficulty
  };
};