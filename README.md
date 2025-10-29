# Mejikuhibiniu Memory Game

A fun and challenging memory game built with Vue 3 that tests your ability to remember and recreate sequences of colored numbers.

## 🌈 About Mejikuhibiniu

"Mejikuhibiniu" is the Indonesian/Sanskrit mnemonic for remembering the colors of the rainbow in order:

| Letter | Color      | English     |
|--------|------------|-------------|
| **Me** | Merah      | Red         |
| **Ji** | Jingga     | Orange      |
| **Ku** | Kuning     | Yellow      |
| **Hi** | Hijau      | Green       |
| **Bi** | Biru       | Blue        |
| **Ni** | Nila       | Indigo      |
| **U**  | Ungu       | Purple      |

## 🎮 How to Play

### Basic Gameplay:
1. **Memorize Phase**: 
   - The colored number sequence will be displayed
   - Click "Play" to start the timer (10 seconds by default)
   - Remember the exact order of the colored numbers

2. **Selection Phase**:
   - After the timer ends, the reference sequence disappears
   - Click the numbers in the correct **Mejikuhibiniu order** (Red → Orange → Yellow → Green → Blue → Indigo → Purple)
   - Your selections will appear in the "Jawaban Anda" (Your Answer) section

3. **Result Phase**:
   - Once you've selected all numbers, click "Result"
   - See if your sequence matches the original!

### Controls:
- **🔊 Sound Icon**: Toggle sound effects on/off
- **🎚️ Difficulty Levels**: Choose from Easy (4 numbers), Medium (6 numbers), or Hard (7 numbers)
- **▶️ Play**: Start the memorization timer
- **🔄 Reset**: Start a new game with a fresh sequence
- **✅ Result**: Check your answer against the original sequence

## ✨ Key Features

### 🎯 Multiple Difficulty Levels
- **Easy**: 4 numbers, 15 seconds to memorize
- **Medium**: 6 numbers, 10 seconds to memorize  
- **Hard**: 7 numbers, 7 seconds to memorize

### 🔊 Sound Effects
- Selection sounds when choosing numbers
- Win/lose melodies for results
- Adjustable volume control
- Mute toggle switch

### 📊 Game Statistics
- Track your wins and losses
- View win/loss ratio
- See detailed game history

### 🎨 Modern UI/UX
- Clean, colorful interface with smooth animations
- Responsive design that works on all devices
- Clear visual feedback for game states
- Accessible controls with keyboard support

## 🛠️ Technical Details

### Built With:
- **Vue 3** with Composition API for modern reactive programming
- **TypeScript** for type safety and better code quality
- **Vite** for ultra-fast development and building
- **Tailwind CSS** for responsive, utility-first styling
- **Vitest** for comprehensive testing

### Architecture:
```
src/
├── components/          # Reusable UI components
├── composables/         # Vue Composition API logic
├── services/            # Business logic and utilities
├── App.vue             # Main application component
├── data.ts             # Data structures and generators
└── style.css           # Global styling
```

### Testing:
- Unit tests for core game logic
- Component tests for UI functionality
- Continuous integration with automated testing

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

## 📝 Git Commit Message Guidelines

### Commit Message Format
We follow the conventional commits specification for consistent and meaningful commit messages:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Types
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Examples
```bash
# Good commit messages
feat(game): add difficulty levels with timer adjustments
fix(sound): resolve audio context initialization on page refresh
docs(readme): update installation instructions
style(ui): improve button hover effects and transitions
refactor(components): split App.vue into smaller components
test(useGame): add comprehensive test coverage for game logic
```

### Best Practices
1. **Use present tense** ("add feature" not "added feature")
2. **Use imperative mood** ("move cursor to..." not "moves cursor to...")
3. **Limit subject line to 50 characters**
4. **Capitalize the subject line**
5. **Do not end the subject line with a period**
6. **Separate subject from body with a blank line**
7. **Wrap the body at 72 characters**
8. **Use the body to explain what and why vs. how**

### Scope Examples
- `game` - Game logic and mechanics
- `ui` - User interface components
- `sound` - Audio functionality
- `storage` - Local storage and persistence
- `components` - Vue components
- `composables` - Vue composables
- `services` - Service layers
- `tests` - Test files
- `build` - Build system configuration
- `deps` - Dependency updates

## 🎯 Tips for Success

1. **Focus on color order** first, then the numbers
2. **Practice with Easy mode** to get familiar with the game
3. **Use the sound effects** to help reinforce your memory
4. **Pay attention to the timer** - don't rush your memorization!

Enjoy challenging your memory and improving your focus with Mejikuhibiniu!
