import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { useGame } from '../composables/useGame';

describe('useGame composable', () => {
  beforeEach(() => {
    // Mock window.setInterval and window.clearInterval
    window.setInterval = vi.fn(setInterval);
    window.clearInterval = vi.fn(clearInterval);
  });

  afterEach(() => {
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
    expect(state.value.timerSecond).toBe(10);
    expect(state.value.timerId).toBe(null);
  });

  it('initializes game with a new sequence', () => {
    const { state, initializeGame } = useGame();
    
    initializeGame();
    
    // Medium difficulty has 6 items by default
    expect(state.value.originalSequence).toHaveLength(6);
    expect(state.value.displaySequence).toHaveLength(6);
    expect(state.value.playerSequence).toEqual([]);
    expect(state.value.gameResult).toEqual({ result: "", bool: false });
    expect(state.value.isMemorizing).toBe(true);
    expect(state.value.isPlaying).toBe(false);
    // Medium difficulty has 10 seconds by default
    expect(state.value.timerSecond).toBe(10);
  });

  it('shuffles the array correctly', () => {
    const { state, initializeGame, shuffleArray } = useGame();
    
    initializeGame();
    const originalSequence = [...state.value.originalSequence];
    
    shuffleArray();
    
    // The sequence should still have the same items but in different order (6 for medium difficulty)
    expect(state.value.displaySequence).toHaveLength(6);
    // Check that all items from original are present in shuffled
    const originalNames = originalSequence.map(item => item.name);
    const shuffledNames = state.value.displaySequence.map(item => item.name);
    
    expect(shuffledNames.sort()).toEqual(originalNames.sort());
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
    expect(state.value.timerSecond).toBe(10);
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
});