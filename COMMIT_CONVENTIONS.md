# Git Commit Message Conventions

This project follows the conventional commits specification for consistent and meaningful commit messages.

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Commit Types

- **feat**: A new feature or enhancement
- **fix**: A bug fix
- **docs**: Documentation changes only
- **style**: Changes that don't affect meaning (formatting, whitespace, etc.)
- **refactor**: Code changes that don't fix bugs or add features
- **perf**: Performance improvements
- **test**: Adding or modifying tests
- **build**: Build system or dependency changes
- **ci**: CI configuration changes
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverting a previous commit

## Examples by File Type

### Vue Components (`*.vue` files)
```
feat(ui): add difficulty selector component
fix(components): correct number grid responsiveness
style(buttons): update button hover effects in GameControls
refactor(PlayerSequence): simplify sequence display logic
```

### Composables (`composables/*.ts`)
```
feat(game): add timer functionality to useGame
fix(composables): resolve memory leak in useGame
perf(useGame): optimize sequence generation algorithm
```

### Services (`services/*.ts`)
```
feat(storage): implement game history persistence
fix(sound): resolve audio context initialization
refactor(gameHistory): improve stats calculation
```

### Data/Constants (`data.ts`, `constants.ts`)
```
feat(data): add new color themes
refactor(constants): organize difficulty levels
chore(data): update color mappings
```

### CSS/Style Files
```
style(ui): improve button styling
style(mobile): add responsive breakpoints
style(theme): update color scheme
```

### Test Files (`*.test.ts`)
```
test(GameControls): add button interaction tests
test(useGame): verify timer behavior
test(components): validate sequence display
```

## Best Practices

1. **Use present tense**: "add feature" not "added feature"
2. **Use imperative mood**: "move cursor to..." not "moves cursor to..."
3. **Limit subject line to 50 characters**
4. **Capitalize the subject line**
5. **Do not end subject line with a period**
6. **Separate subject from body with a blank line**
7. **Wrap body at 72 characters**
8. **Use body to explain what and why vs. how**

### Scope Examples
- `game` - Game logic and mechanics
- `ui` - User interface components
- `components` - Vue components
- `composables` - Vue composables
- `services` - Service layers
- `sound` - Audio functionality
- `storage` - Local storage and persistence
- `tests` - Test files
- `build` - Build system configuration
- `deps` - Dependency updates