// Game configuration constants
export const GAME_CONFIG = {
  DEFAULT_TIMER: 10,
  COLORS: [
    { color: "text-red", name: "me", label: "Merah" },
    { color: "text-orange", name: "ji", label: "Jingga" },
    { color: "text-yellow", name: "ku", label: "Kuning" },
    { color: "text-green", name: "hi", label: "Hijau" },
    { color: "text-blue", name: "bi", label: "Biru" },
    { color: "text-nila", name: "ni", label: "Nila" },
    { color: "text-purple", name: "u", label: "Ungu" }
  ],
  DIFFICULTY_LEVELS: {
    EASY: { name: 'Mudah', sequenceLength: 4, timerSeconds: 15 },
    MEDIUM: { name: 'Sedang', sequenceLength: 6, timerSeconds: 10 },
    HARD: { name: 'Sulit', sequenceLength: 7, timerSeconds: 7 }
  }
};

// UI constants
export const UI_CONSTANTS = {
  GRID_SIZE: {
    DEFAULT: 'w-12 h-12',
    SMALL: 'w-10 h-10',
    LARGE: 'w-16 h-16'
  },
  ANIMATION_DURATION: 300 // ms
};

// Sound constants
export const SOUND_CONSTANTS = {
  ENABLED_KEY: 'soundEnabled',
  VOLUME_KEY: 'soundVolume'
};