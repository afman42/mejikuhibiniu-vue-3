import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useGame } from '../composables/useGame';
import { GAME_CONFIG } from '../constants';

describe('useGame composable', () => {
  let originalSetInterval: any;
  let originalClearInterval: any;

  beforeEach(() => {
    // Store original functions to restore later
    originalSetInterval = window.setInterval;
    originalClearInterval = window.clearInterval;
    
    // Mock window.setInterval and window.clearInterval
    window.setInterval = vi.fn((callback) => {
      // Use setImmediate for immediate execution in tests
      return setTimeout(callback, 0) as any;
    });
    window.clearInterval = vi.fn((id) => {
      clearTimeout(id);
    });
  });

  afterEach(() => {
    // Restore original functions
    window.setInterval = originalSetInterval;
    window.clearInterval = originalClearInterval;
    vi.clearAllMocks();
  });

  it('initializes with default state', () => {
    const { state } = useGame();
    
    expect(state.value.originalSequence).toEqual([]);
    expect(state.value.displaySequence).toEqual([]);
    expect(state.value.playerSequence).toEqual([]);
    expect(state.value.gameResult).toEqual({ result: "", bool: false });
    expect(state.value.isMemorizing).toBe(true);
    expect(state.value.isPlaying).toBe(false);
    expect(state.value.timerSecond).toBe(GAME_CONFIG.DEFAULT_TIMER);
    expect(state.value.timerId).toBe(null);
    expect(state.value.difficulty).toBe('MEDIUM');
    expect(state.value.startTime).toBe(null);
    expect(state.value.totalSelectionTime).toBe(0);
  });

  it('initializes game with a new sequence', () => {
    const { state, initializeGame } = useGame();
    
    initializeGame();
    
    // Medium difficulty has 6 items by default
    expect(state.value.originalSequence).toHaveLength(
      GAME_CONFIG.DIFFICULTY_LEVELS.MEDIUM.sequenceLength
    );
    expect(state.value.displaySequence).toHaveLength(
      GAME_CONFIG.DIFFICULTY_LEVELS.MEDIUM.sequenceLength
    );
    expect(state.value.playerSequence).toEqual([]);
    expect(state.value.gameResult).toEqual({ result: "", bool: false });
    expect(state.value.isMemorizing).toBe(true);
    expect(state.value.isPlaying).toBe(false);
    // Medium difficulty has 10 seconds by default
    expect(state.value.timerSecond).toBe(
      GAME_CONFIG.DIFFICULTY_LEVELS.MEDIUM.timerSeconds
    );
  });

  it('shuffles the array correctly', () => {
    const { state, initializeGame, shuffleArray } = useGame();
    
    initializeGame();
    const originalSequence = [...state.value.originalSequence];
    
    shuffleArray();
    
    // The sequence should still have the same items but in different order
    expect(state.value.displaySequence).toHaveLength(originalSequence.length);
    // Check that all items from original are present in shuffled
    const originalNames = originalSequence.map(item => item.name);
    const shuffledNames = state.value.displaySequence.map(item => item.name);
    
    expect(shuffledNames.sort()).toEqual(originalNames.sort());
    
    // Ensure original sequence is unchanged
    expect(state.value.originalSequence.map(item => item.name).sort()).toEqual(originalNames.sort());
  });

  it('starts the timer correctly', () => {
    const { state, startTimer } = useGame();
    
    startTimer();
    
    expect(state.value.isPlaying).toBe(true);
    expect(state.value.isMemorizing).toBe(false);
    expect(window.setInterval).toHaveBeenCalled();
  });

  it('stops the timer correctly', () => {
    const { state, startTimer, stopTimer } = useGame();
    
    startTimer(); // Start the timer first
    stopTimer(); // Then stop it
    
    expect(state.value.timerId).toBe(null);
    expect(window.clearInterval).toHaveBeenCalled();
  });

  it('resets the game correctly', () => {
    const { state, initializeGame, resetGame } = useGame();
    
    // Set up some initial state
    initializeGame();
    state.value.playerSequence = [{ color: 'text-red', name: 'me', nbr: 123 }];
    state.value.gameResult = { result: 'Menang', bool: true };
    state.value.timerSecond = 5;
    
    resetGame();
    
    expect(state.value.playerSequence).toEqual([]);
    expect(state.value.gameResult).toEqual({ result: "", bool: false });
    expect(state.value.timerSecond).toBe(
      GAME_CONFIG.DIFFICULTY_LEVELS.MEDIUM.timerSeconds
    );
    expect(state.value.isMemorizing).toBe(true);
    expect(state.value.isPlaying).toBe(false);
  });

  it('selects a number correctly', () => {
    const { state, initializeGame, selectNumber } = useGame();
    
    initializeGame();
    // Set game to playable state
    state.value.isPlaying = true;
    state.value.timerSecond = 0;
    
    const firstNumber = state.value.displaySequence[0];
    selectNumber(firstNumber);
    
    expect(state.value.playerSequence).toHaveLength(1);
    expect(state.value.playerSequence[0]).toEqual(firstNumber);
  });

  it('prevents selecting the same number twice', () => {
    const { state, initializeGame, selectNumber } = useGame();
    
    initializeGame();
    // Set game to playable state
    state.value.isPlaying = true;
    state.value.timerSecond = 0;
    
    const firstNumber = state.value.displaySequence[0];
    selectNumber(firstNumber);
    selectNumber(firstNumber); // Try to select the same number again
    
    expect(state.value.playerSequence).toHaveLength(1);
    expect(state.value.playerSequence[0]).toEqual(firstNumber);
  });

  it('prevents selecting more numbers than sequence length', () => {
    const { state, initializeGame, selectNumber } = useGame();
    
    initializeGame();
    // Set game to playable state
    state.value.isPlaying = true;
    state.value.timerSecond = 0;
    
    // Select all possible numbers from display sequence
    state.value.displaySequence.forEach(item => {
      selectNumber(item);
    });
    
    // Try to select one more (should not be allowed)
    if (state.value.displaySequence.length > 0) {
      selectNumber(state.value.displaySequence[0]);
    }
    
    // Should only have the original sequence length in player sequence
    expect(state.value.playerSequence).toHaveLength(state.value.originalSequence.length);
  });

  it('removes a number correctly', () => {
    const { state, initializeGame, selectNumber, removeNumber } = useGame();
    
    initializeGame();
    // Set game to playable state
    state.value.isPlaying = true;
    state.value.timerSecond = 0;
    
    // Add a number to the player sequence
    const firstNumber = state.value.displaySequence[0];
    selectNumber(firstNumber);
    expect(state.value.playerSequence).toHaveLength(1);
    
    // Remove the number
    removeNumber(firstNumber.name);
    expect(state.value.playerSequence).toHaveLength(0);
  });

  it('prevents removing numbers after game result is shown', () => {
    const { state, initializeGame, selectNumber, removeNumber } = useGame();
    
    initializeGame();
    // Set game to playable state
    state.value.isPlaying = true;
    state.value.timerSecond = 0;
    
    // Add a number to the player sequence
    const firstNumber = state.value.displaySequence[0];
    selectNumber(firstNumber);
    expect(state.value.playerSequence).toHaveLength(1);
    
    // Set game result to true (game over)
    state.value.gameResult = { result: 'Menang', bool: true };
    
    // Try to remove the number (should not be allowed)
    removeNumber(firstNumber.name);
    expect(state.value.playerSequence).toHaveLength(1);
  });

  it('checks result correctly for winning case', () => {
    const { state, initializeGame, checkResult } = useGame();
    
    initializeGame();
    
    // Set player sequence to match original sequence
    state.value.playerSequence = [...state.value.originalSequence];
    
    checkResult();
    
    expect(state.value.gameResult.result).toBe('Menang');
    expect(state.value.gameResult.bool).toBe(true);
  });

  it('checks result correctly for losing case', () => {
    const { state, initializeGame, checkResult } = useGame();
    
    initializeGame();
    
    // Set player sequence to be different from original
    state.value.playerSequence = [
      { color: 'text-red', name: 'me', nbr: 999 },
      { color: 'text-orange', name: 'ji', nbr: 888 },
      { color: 'text-yellow', name: 'ku', nbr: 777 },
      { color: 'text-green', name: 'hi', nbr: 666 },
      { color: 'text-blue', name: 'bi', nbr: 555 },
      { color: 'text-nila', name: 'ni', nbr: 444 },
      { color: 'text-purple', name: 'u', nbr: 333 }
    ];
    
    checkResult();
    
    expect(state.value.gameResult.result).toBe('Kalah');
    expect(state.value.gameResult.bool).toBe(true);
  });

  it('handles sequence length mismatch correctly', () => {
    const { state, initializeGame, checkResult } = useGame();
    
    initializeGame();
    
    // Set player sequence with different length than original
    state.value.playerSequence = state.value.originalSequence.slice(0, -1); // One less item
    
    checkResult();
    
    expect(state.value.gameResult.result).toBe('Kalah'); // Should be a loss
    expect(state.value.gameResult.bool).toBe(true);
  });

  it('sets difficulty correctly', () => {
    const { state, setDifficulty } = useGame();
    
    setDifficulty('EASY');
    
    expect(state.value.difficulty).toBe('EASY');
    expect(state.value.timerSecond).toBe(
      GAME_CONFIG.DIFFICULTY_LEVELS.EASY.timerSeconds
    );
  });

  it('handles timer expiration and starts selection phase', () => {
    const { state, startTimer } = useGame();
    
    startTimer();
    
    // Simulate timer expiration by setting timerSecond to 0
    state.value.timerSecond = 0;
    
    expect(state.value.timerSecond).toBe(0);
    expect(state.value.isPlaying).toBe(true);
  });

  it('prevents selection when game is still in timer phase', () => {
    const { state, initializeGame, selectNumber } = useGame();
    
    initializeGame();
    // Set game to playable state but with timer still running
    state.value.isPlaying = true;
    state.value.timerSecond = 5; // Timer still running
    
    const firstNumber = state.value.displaySequence[0];
    selectNumber(firstNumber);
    
    // Should not have selected the number because timer is still running
    expect(state.value.playerSequence).toHaveLength(0);
  });

  it('prevents selection when game is not active', () => {
    const { state, initializeGame, selectNumber } = useGame();
    
    initializeGame();
    // Set game to non-playable state
    state.value.isPlaying = false;
    state.value.timerSecond = 0;
    
    const firstNumber = state.value.displaySequence[0];
    selectNumber(firstNumber);
    
    // Should not have selected the number because game is not active
    expect(state.value.playerSequence).toHaveLength(0);
  });

  it('handles cleanup correctly', () => {
    const { stopTimer } = useGame();
    
    // Try to stop a non-existent timer
    stopTimer();
    
    // Should not throw an error
    expect(window.clearInterval).not.toHaveBeenCalled();
  });
});