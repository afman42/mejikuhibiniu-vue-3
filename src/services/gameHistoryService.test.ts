import { describe, it, expect, vi, beforeEach } from 'vitest';
import { gameHistoryService } from './gameHistoryService';

describe('GameHistoryService', () => {
  beforeEach(() => {
    // Clear history before each test
    gameHistoryService['entries'] = [];
    localStorage.clear();
  });

  it('should add entries and update stats correctly', () => {
    // Initially no games
    let stats = gameHistoryService.getStats();
    expect(stats.totalGames).toBe(0);
    expect(stats.wins).toBe(0);
    expect(stats.losses).toBe(0);
    expect(stats.winRate).toBe(0);

    // Add a win
    gameHistoryService.addEntry({
      date: new Date(),
      difficulty: 'Easy',
      won: true,
      sequenceLength: 4,
      timeTaken: 30,
      attempts: 4
    });

    stats = gameHistoryService.getStats();
    expect(stats.totalGames).toBe(1);
    expect(stats.wins).toBe(1);
    expect(stats.losses).toBe(0);
    expect(stats.winRate).toBe(100);

    // Add a loss
    gameHistoryService.addEntry({
      date: new Date(),
      difficulty: 'Medium',
      won: false,
      sequenceLength: 6,
      timeTaken: 45,
      attempts: 6
    });

    stats = gameHistoryService.getStats();
    expect(stats.totalGames).toBe(2);
    expect(stats.wins).toBe(1);
    expect(stats.losses).toBe(1);
    expect(stats.winRate).toBe(50);
  });

  it('should handle win rate calculation correctly', () => {
    // Add 2 wins and 1 loss
    gameHistoryService.addEntry({
      date: new Date(),
      difficulty: 'Easy',
      won: true,
      sequenceLength: 4,
      timeTaken: 30,
      attempts: 4
    });

    gameHistoryService.addEntry({
      date: new Date(),
      difficulty: 'Easy',
      won: true,
      sequenceLength: 4,
      timeTaken: 25,
      attempts: 4
    });

    gameHistoryService.addEntry({
      date: new Date(),
      difficulty: 'Easy',
      won: false,
      sequenceLength: 4,
      timeTaken: 40,
      attempts: 4
    });

    const stats = gameHistoryService.getStats();
    expect(stats.totalGames).toBe(3);
    expect(stats.wins).toBe(2);
    expect(stats.losses).toBe(1);
    expect(stats.winRate).toBe(67); // 2/3 = 0.666... ≈ 67%
  });

  it('should support subscription to changes', () => {
    const mockCallback = vi.fn();
    const unsubscribe = gameHistoryService.subscribe(mockCallback);

    // Initially called once
    expect(mockCallback).toHaveBeenCalledTimes(0);

    // Add an entry - should trigger the callback
    gameHistoryService.addEntry({
      date: new Date(),
      difficulty: 'Easy',
      won: true,
      sequenceLength: 4,
      timeTaken: 30,
      attempts: 4
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);

    // Clear history - should trigger the callback again
    gameHistoryService.clearHistory();

    expect(mockCallback).toHaveBeenCalledTimes(2);

    // Unsubscribe and make sure callback is not called anymore
    unsubscribe();

    gameHistoryService.addEntry({
      date: new Date(),
      difficulty: 'Hard',
      won: false,
      sequenceLength: 7,
      timeTaken: 20,
      attempts: 7
    });

    // Callback should not have been called after unsubscribe
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });
});