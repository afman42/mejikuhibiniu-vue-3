export interface GameHistoryEntry {
  id: string;
  date: Date;
  difficulty: string;
  won: boolean;
  sequenceLength: number;
  timeTaken: number; // in seconds
  attempts: number;
}

class GameHistoryService {
  private storageKey = 'mejikuhibiniu_game_history';
  private entries: GameHistoryEntry[] = [];

  constructor() {
    this.loadHistory();
  }

  private loadHistory() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.entries = parsed.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        }));
      }
    } catch (e) {
      console.error('Error loading game history:', e);
      this.entries = [];
    }
  }

  private saveHistory() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.entries));
    } catch (e) {
      console.error('Error saving game history:', e);
    }
  }

  public addEntry(entry: Omit<GameHistoryEntry, 'id'>): GameHistoryEntry {
    const newEntry: GameHistoryEntry = {
      ...entry,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    
    this.entries.unshift(newEntry); // Add to the beginning
    // Limit to 20 most recent games
    if (this.entries.length > 20) {
      this.entries = this.entries.slice(0, 20);
    }
    
    this.saveHistory();
    return newEntry;
  }

  public getHistory(): GameHistoryEntry[] {
    return [...this.entries]; // Return a copy to prevent external mutations
  }

  public getStats() {
    const totalGames = this.entries.length;
    const wins = this.entries.filter(entry => entry.won).length;
    const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
    
    return {
      totalGames,
      wins,
      losses: totalGames - wins,
      winRate
    };
  }

  public clearHistory() {
    this.entries = [];
    this.saveHistory();
  }
}

export const gameHistoryService = new GameHistoryService();