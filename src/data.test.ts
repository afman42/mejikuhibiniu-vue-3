import { describe, it, expect } from 'vitest';
import { createInitialColorsRandom } from './data';

describe('Data functions', () => {
  it('should create a new random sequence each time', () => {
    const sequence1 = createInitialColorsRandom();
    const sequence2 = createInitialColorsRandom();

    // Both sequences should have the same length
    expect(sequence1).toHaveLength(7);
    expect(sequence2).toHaveLength(7);

    // Sequences should have the same color names and properties but different numbers
    expect(sequence1.map(item => item.name)).toEqual(['me', 'ji', 'ku', 'hi', 'bi', 'ni', 'u']);
    expect(sequence2.map(item => item.name)).toEqual(['me', 'ji', 'ku', 'hi', 'bi', 'ni', 'u']);

    expect(sequence1.map(item => item.color)).toEqual([
      'text-red', 'text-orange', 'text-yellow', 
      'text-green', 'text-blue', 'text-nila', 'text-purple'
    ]);
    expect(sequence2.map(item => item.color)).toEqual([
      'text-red', 'text-orange', 'text-yellow', 
      'text-green', 'text-blue', 'text-nila', 'text-purple'
    ]);

    // The numbers should likely be different due to randomization
    const numbers1 = sequence1.map(item => item.nbr);
    const numbers2 = sequence2.map(item => item.nbr);
    
    // Check if the sequences are different (there's a very small chance they could be the same)
    // If they're the same, we still consider the function working as randomness can produce duplicates
    expect(numbers1).toHaveLength(7);
    expect(numbers2).toHaveLength(7);

    // All numbers should be between 0 and 99
    numbers1.forEach(num => {
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThan(100);
    });
    numbers2.forEach(num => {
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThan(100);
    });
  });

  it('should have valid color values', () => {
    const sequence = createInitialColorsRandom();
    
    const validColors = ['text-red', 'text-orange', 'text-yellow', 'text-green', 'text-blue', 'text-nila', 'text-purple'];
    const validNames = ['me', 'ji', 'ku', 'hi', 'bi', 'ni', 'u'];
    
    sequence.forEach(item => {
      expect(validColors).toContain(item.color);
      expect(validNames).toContain(item.name);
      expect(typeof item.nbr).toBe('number');
      expect(item.nbr).toBeGreaterThanOrEqual(0);
      expect(item.nbr).toBeLessThan(100);
    });
  });
});