# Mejikuhibiniu - Memory Game

A colorful, engaging memory sequence game built with Vue 3, featuring smooth animations, touch gestures, performance optimizations, and Progressive Web App (PWA) capabilities.

## Features

### Core Gameplay
- **Memory Challenge**: Remember and recreate color-coded number sequences
- **Difficulty Levels**: Easy, Medium, and Hard modes with varying sequence lengths
- **Timer-based Gameplay**: Complete sequences within the time limit
- **Progress Tracking**: Game history and statistics

### Enhanced User Experience
- **Smooth Animations**: Beautiful transitions and visual feedback
- **Touch Gestures**: Intuitive swipe controls for mobile devices
- **Responsive Design**: Works seamlessly on all device sizes
- **Sound Effects**: Audio feedback for game events

### Advanced Features
- **Progressive Web App (PWA)**: Installable, works offline with service worker
- **Performance Optimized**: Efficient rendering and algorithms for smooth gameplay
- **Accessibility**: Screen reader support and keyboard navigation

## Tech Stack

- **Vue 3**: Composition API with TypeScript
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first styling framework
- **Vitest**: Unit testing framework
- **vue3-touch-events**: Touch gesture support
- **vite-plugin-pwa**: PWA capabilities

## Project Structure

```
src/
├── components/          # Vue components
│   ├── SequenceDisplay.vue    # Displays original sequence
│   ├── NumberGrid.vue         # Grid of numbers to select
│   ├── PlayerSequence.vue     # Player's selected sequence
│   ├── GameControls.vue       # Play, reset, check buttons
│   ├── DifficultySelector.vue # Difficulty selection
│   ├── SoundControls.vue      # Audio settings
│   ├── GameHistory.vue        # Game history display
│   └── PWAInstallPrompt.vue   # PWA installation prompt
├── composables/         # Vue composables
│   └── useGame.ts       # Game logic and state management
├── services/            # Service utilities
│   ├── soundService.ts  # Audio management
│   ├── gameHistoryService.ts # Game history management
│   └── pwaService.ts    # PWA functionality
├── data/                # Data models and configuration
│   ├── data.ts          # Color and number generation
│   └── constants.ts     # Game configuration
└── main.ts              # Application entry point
```

## Key Improvements

### 1. Animations & Transitions
- **Smooth Animations**: Added transition-group components with "flip-list" animations
- **Performance Optimized**: Used `v-memo` directive to prevent unnecessary re-renders
- **Visual Feedback**: Enhanced UX with fade-slide transitions between game states

### 2. Touch Gestures
- **Swipe Support**: Added horizontal swipe gestures for navigation
- **Mobile Optimization**: Intuitive touch controls for mobile devices
- **Double-tap**: Quick removal functionality for faster gameplay

### 3. Performance Optimizations
- **Efficient Algorithm**: Optimized sequence comparison with efficient loop-based checking
- **Shuffling**: Memoized shuffle function for better performance
- **State Management**: Used shallowRef for improved performance

### 4. Progressive Web App (PWA)
- **Installable**: Users can install the app on their homescreen
- **Offline Support**: Works without internet connection
- **Service Worker**: Caching strategy for offline availability
- **Manifest**: Proper PWA manifest with app metadata

## Setup & Development

### Prerequisites
- Node.js 16+ 
- pnpm (recommended)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd mejikuhibiniu-vue-3

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Development Scripts
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm test         # Run unit tests
```

### Building
```bash
pnpm build
```
The PWA will be built to the `dist/` directory with service worker and manifest files.

## Testing

The project includes comprehensive unit tests covering:
- Core game logic
- Component functionality
- Animation handling
- Touch gesture support
- PWA features
- Performance optimizations

Run tests with:
```bash
pnpm test
```

## Deployment

The application is configured as a PWA and can be deployed to any static hosting service. The build process generates all necessary PWA files including:
- Service worker for offline functionality
- Manifest file for app installation
- App icons in various sizes

## Browser Support

- Modern browsers with ES6+ support
- Progressive enhancement for older browsers
- Full PWA support on Chrome, Firefox, Safari, and Edge

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with Vue 3 and Vite
- Uses Tailwind CSS for styling
- Incorporates touch gesture support for mobile
- Features PWA capabilities for progressive enhancement

---

## About the Name

"Mejikuhibiniu" comes from the Indonesian names for rainbow colors:
- **Me**rah (Red)
- **Ji**ngga (Orange) 
- **Ku**ning (Yellow)
- **Hi**jau (Green)
- **Bi**ru (Blue)
- **Ni**la (Indigo)
- **U**ngu (Purple)

Play the game and try to remember the colorful sequence!