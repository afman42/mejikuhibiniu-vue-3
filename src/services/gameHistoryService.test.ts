import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { gameHistoryService } from './gameHistoryService';

describe('GameHistoryService', () => {
  beforeEach(() => {
    // Clear history before each test
    gameHistoryService['entries'] = [];
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should have initial empty state', () => {
    const stats = gameHistoryService.getStats();
    expect(stats.totalGames).toBe(0);
    expect(stats.wins).toBe(0);
    expect(stats.losses).toBe(0);
    expect(stats.winRate).toBe(0);
    expect(gameHistoryService.getHistory()).toEqual([]);
  });

  it('should add entries and update stats correctly', () => {
    // Initially no games
    let stats = gameHistoryService.getStats();
    expect(stats.totalGames).toBe(0);
    expect(stats.wins).toBe(0);
    expect(stats.losses).toBe(0);
    expect(stats.winRate).toBe(0);

    // Add a win
    const winEntry = {
      date: new Date(),
      difficulty: 'Easy',
      won: true,
      sequenceLength: 4,
      timeTaken: 30,
      attempts: 4
    };
    gameHistoryService.addEntry(winEntry);

    stats = gameHistoryService.getStats();
    expect(stats.totalGames).toBe(1);
    expect(stats.wins).toBe(1);
    expect(stats.losses).toBe(0);
    expect(stats.winRate).toBe(100);

    // Verify the entry was added correctly
    const entries = gameHistoryService.getHistory();
    expect(entries).toHaveLength(1);
    expect(entries[0]).toEqual(expect.objectContaining(winEntry));

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

  it('should handle 0% win rate correctly', () => {
    // Add only losses
    gameHistoryService.addEntry({
      date: new Date(),
      difficulty: 'Easy',
      won: false,
      sequenceLength: 4,
      timeTaken: 30,
      attempts: 4
    });

    gameHistoryService.addEntry({
      date: new Date(),
      difficulty: 'Easy',
      won: false,
      sequenceLength: 4,
      timeTaken: 25,
      attempts: 4
    });

    const stats = gameHistoryService.getStats();
    expect(stats.totalGames).toBe(2);
    expect(stats.wins).toBe(0);
    expect(stats.losses).toBe(2);
    expect(stats.winRate).toBe(0);
  });

  it('should handle 100% win rate correctly', () => {
    // Add only wins
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

    const stats = gameHistoryService.getStats();
    expect(stats.totalGames).toBe(2);
    expect(stats.wins).toBe(2);
    expect(stats.losses).toBe(0);
    expect(stats.winRate).toBe(100);
  });

  it('should handle edge case of no games played (0 games)', () => {
    const stats = gameHistoryService.getStats();
    expect(stats.totalGames).toBe(0);
    expect(stats.wins).toBe(0);
    expect(stats.losses).toBe(0);
    expect(stats.winRate).toBe(0);
  });

  it('should support subscription to changes', () => {
    const mockCallback = vi.fn();
    const unsubscribe = gameHistoryService.subscribe(mockCallback);

    // Initially called once if there are existing entries (but we cleared them)
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

  it('should handle multiple subscriptions correctly', () => {
    const mockCallback1 = vi.fn();
    const mockCallback2 = vi.fn();
    
    const unsubscribe1 = gameHistoryService.subscribe(mockCallback1);
    const unsubscribe2 = gameHistoryService.subscribe(mockCallback2);

    // Add an entry - both callbacks should trigger
    gameHistoryService.addEntry({
      date: new Date(),
      difficulty: 'Easy',
      won: true,
      sequenceLength: 4,
      timeTaken: 30,
      attempts: 4
    });

    expect(mockCallback1).toHaveBeenCalledTimes(1);
    expect(mockCallback2).toHaveBeenCalledTimes(1);

    // Unsubscribe one and add another entry
    unsubscribe1();

    gameHistoryService.addEntry({
      date: new Date(),
      difficulty: 'Hard',
      won: false,
      sequenceLength: 7,
      timeTaken: 20,
      attempts: 7
    });

    expect(mockCallback1).toHaveBeenCalledTimes(1); // Should not have increased
    expect(mockCallback2).toHaveBeenCalledTimes(2); // Should have increased
  });

  it('should clear history correctly', () => {
    // Add some entries
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
      difficulty: 'Medium',
      won: false,
      sequenceLength: 6,
      timeTaken: 45,
      attempts: 6
    });

    // Verify entries exist
    expect(gameHistoryService.getHistory()).toHaveLength(2);
    let stats = gameHistoryService.getStats();
    expect(stats.totalGames).toBe(2);

    // Clear history
    gameHistoryService.clearHistory();

    // Verify history is cleared
    expect(gameHistoryService.getHistory()).toEqual([]);
    stats = gameHistoryService.getStats();
    expect(stats.totalGames).toBe(0);
    expect(stats.wins).toBe(0);
    expect(stats.losses).toBe(0);
    expect(stats.winRate).toBe(0);
  });

  it('should handle entries with special values', () => {
    // Test with entries that have zero values for time or attempts
    gameHistoryService.addEntry({
      date: new Date(),
      difficulty: 'Easy',
      won: true,
      sequenceLength: 0, // Edge case: zero length
      timeTaken: 0,      // Edge case: zero time
      attempts: 0        // Edge case: zero attempts
    });

    const entries = gameHistoryService.getHistory();
    expect(entries).toHaveLength(1);
    expect(entries[0].sequenceLength).toBe(0);
    expect(entries[0].timeTaken).toBe(0);
    expect(entries[0].attempts).toBe(0);

    const stats = gameHistoryService.getStats();
    expect(stats.totalGames).toBe(1);
    expect(stats.wins).toBe(1);
  });

  it('should maintain correct stats after clearing and adding more entries', () => {
    // Add some entries
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
      difficulty: 'Medium',
      won: false,
      sequenceLength: 6,
      timeTaken: 45,
      attempts: 6
    });

    // Verify initial stats
    let stats = gameHistoryService.getStats();
    expect(stats.totalGames).toBe(2);
    expect(stats.wins).toBe(1);
    expect(stats.losses).toBe(1);
    expect(stats.winRate).toBe(50);

    // Clear and add new entries
    gameHistoryService.clearHistory();

    gameHistoryService.addEntry({
      date: new Date(),
      difficulty: 'Hard',
      won: true,
      sequenceLength: 7,
      timeTaken: 25,
      attempts: 7
    });

    // Verify new stats (should be fresh)
    stats = gameHistoryService.getStats();
    expect(stats.totalGames).toBe(1);
    expect(stats.wins).toBe(1);
    expect(stats.losses).toBe(0);
    expect(stats.winRate).toBe(100);
  });

  it('should handle date sorting correctly', () => {
    // Note: The service adds entries with unshift (to the beginning of the array)
    // So the most recent entry will be at index 0
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2023-01-02');
    const date3 = new Date('2023-01-03');

    // Add entries
    gameHistoryService.addEntry({
      date: date3,
      difficulty: 'Hard',
      won: false,
      sequenceLength: 7,
      timeTaken: 20,
      attempts: 7
    });
    // At this point: [date3]

    gameHistoryService.addEntry({
      date: date1,
      difficulty: 'Easy',
      won: true,
      sequenceLength: 4,
      timeTaken: 30,
      attempts: 4
    });
    // At this point: [date1, date3]

    gameHistoryService.addEntry({
      date: date2,
      difficulty: 'Medium',
      won: true,
      sequenceLength: 6,
      timeTaken: 25,
      attempts: 6
    });
    // At this point: [date2, date1, date3] - most recent first

    const entries = gameHistoryService.getHistory();
    expect(entries).toHaveLength(3);
    
    // Entries should be in reverse chronological order (most recent first due to unshift)
    expect(new Date(entries[0].date).toDateString()).toEqual(date2.toDateString());
    expect(new Date(entries[1].date).toDateString()).toEqual(date1.toDateString());
    expect(new Date(entries[2].date).toDateString()).toEqual(date3.toDateString());
  });
});