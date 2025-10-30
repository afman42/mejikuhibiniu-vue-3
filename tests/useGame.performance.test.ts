import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useGame } from '../src/composables/useGame';
import { GAME_CONFIG } from '../src/constants';

describe('useGame composable - Performance Tests', () => {
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

  it('should efficiently compare sequences using optimized loop', () => {
    const { state, initializeGame, checkResult } = useGame();
    
    initializeGame();
    
    // Set player sequence to match original (should be correct)
    state.value.playerSequence = [...state.value.originalSequence];
    
    // Record the initial state
    const initialGameResult = { ...state.value.gameResult };
    
    // Run checkResult which uses the optimized comparison
    checkResult();
    
    // Should be a win
    expect(state.value.gameResult.result).toBe('Menang');
    expect(state.value.gameResult.bool).toBe(true);
  });

  it('should efficiently detect incorrect sequences using optimized loop', () => {
    const { state, initializeGame, checkResult } = useGame();
    
    initializeGame();
    
    // Set player sequence with one different value (should be incorrect)
    state.value.playerSequence = [...state.value.originalSequence];
    if (state.value.playerSequence.length > 0) {
      // Create a new object with a different value to properly simulate an incorrect sequence
      const modifiedItem = { ...state.value.playerSequence[0] };
      modifiedItem.nbr = 999; // Change one number
      state.value.playerSequence[0] = modifiedItem;
    }
    
    // Run checkResult which uses the optimized comparison
    checkResult();
    
    // Should be a loss
    expect(state.value.gameResult.result).toBe('Kalah');
    expect(state.value.gameResult.bool).toBe(true);
  });

  it('should efficiently detect different sequence lengths', () => {
    const { state, initializeGame, checkResult } = useGame();
    
    initializeGame();
    
    // Set player sequence with different length (should be incorrect)
    state.value.playerSequence = state.value.originalSequence.slice(0, -1); // One less item
    
    // Run checkResult which uses the optimized comparison
    checkResult();
    
    // Should be a loss
    expect(state.value.gameResult.result).toBe('Kalah');
    expect(state.value.gameResult.bool).toBe(true);
  });

  it('should handle large sequences efficiently', () => {
    const { state, initializeGame, checkResult } = useGame();
    
    // Temporarily set to a higher difficulty for performance test
    state.value.difficulty = 'HARD';
    initializeGame();
    
    // Test with maximum sequence length
    state.value.playerSequence = [...state.value.originalSequence];
    
    // Run checkResult - should complete efficiently
    const startTime = performance.now();
    checkResult();
    const endTime = performance.now();
    
    // Should complete quickly (less than 10ms for this simple operation)
    expect(endTime - startTime).toBeLessThan(10);
    
    expect(state.value.gameResult.result).toBe('Menang');
  });

  it('should shuffle using the optimized function', () => {
    const { state, initializeGame, shuffleArray } = useGame();
    
    initializeGame();
    const originalSequence = [...state.value.originalSequence];
    
    // Shuffle the array
    shuffleArray();
    
    // The sequence should still have the same items but potentially in different order
    expect(state.value.displaySequence).toHaveLength(originalSequence.length);
    
    // Verify all original items are present
    const originalNames = originalSequence.map(item => item.name);
    const shuffledNames = state.value.displaySequence.map(item => item.name);
    
    expect(shuffledNames.sort()).toEqual(originalNames.sort());
  });
});