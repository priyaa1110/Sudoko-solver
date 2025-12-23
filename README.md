# Sudoku Solver

A feature-rich Sudoku game built with Next.js, Firebase, and Zustand.

## Features

### Core Game Mechanics
- **Difficulty Levels**: Easy, Medium, and Hard puzzles
- **Dual Input Modes**:
  - Normal Mode: Place definitive numbers
  - Pencil Mode: Add candidate notes to cells
- **Auto-Candidate Mode**: Automatically populate all possible candidates
- **Flexible Input**: Select number first or cell first

### Visual Feedback
- **Dynamic Highlighting**:
  - Row/Column/Box highlighting
  - Identical number highlighting
  - Conflict detection with visual warnings
- **Error Counter**: Tracks mistakes with +30 second penalty
- **Timer**: Track solve time with pause capability

### Game Features
- **Undo/Redo System**: Step through move history
- **Hint System**: Get help with a single cell
- **Solver**: Automatically solve the puzzle
- **Settings**: Customize highlighting, timer, error counter, and more

### Multiplayer
- **Private Rooms**: Create or join rooms with unique codes
- **Real-time Sync**: Watch other players in the same room
- **Difficulty Selection**: Host chooses puzzle difficulty

### Progression
- **Anonymous Auth**: Login with username only
- **Profile Tracking**: Best times and games played
- **Leaderboard**: Top 10 fastest solvers

## Setup

### Install Dependencies
```bash
npm install
```

### Firebase Configuration
The app is pre-configured with Firebase. To use your own Firebase project:

1. Update `lib/firebase.js` with your Firebase config
2. Deploy database rules from `database.rules.json` to Firebase Console

### Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
```

This creates a static export in the `docs` folder for GitHub Pages deployment.

### Deploy to GitHub Pages
1. Push the `docs` folder to your repository
2. Enable GitHub Pages in repository settings
3. Set source to `docs` folder
4. Access at `https://[username].github.io/[repo-name]/`

## Project Structure

```
├── app/
│   ├── layout.js          # Root layout
│   ├── page.js            # Main game page
│   └── globals.css        # Global styles
├── components/
│   ├── SudokuBoard.js     # Game board component
│   ├── NumberPad.js       # Number input pad
│   ├── GameControls.js    # Game control buttons
│   ├── GameStats.js       # Timer and stats display
│   ├── DifficultyMenu.js  # Difficulty selection
│   ├── SettingsModal.js   # Settings configuration
│   ├── RoomManager.js     # Multiplayer room management
│   └── Leaderboard.js     # Top scores display
├── lib/
│   ├── firebase.js        # Firebase initialization
│   ├── auth.js            # Authentication helpers
│   ├── profile.js         # User profile management
│   ├── leaderboard.js     # Leaderboard operations
│   ├── rooms.js           # Multiplayer room operations
│   ├── store/
│   │   └── gameStore.js   # Zustand game state
│   └── sudoku/
│       ├── generator.js   # Puzzle generation
│       ├── solver.js      # Puzzle solving logic
│       └── validator.js   # Move validation
└── database.rules.json    # Firebase security rules
```

## Technologies

- **Next.js 16.1.1**: React framework with static export
- **React 19.2.3**: UI library
- **Firebase 12.7.0**: Authentication and Realtime Database
- **Zustand 5.0.9**: State management
- **clsx 2.1.1**: Conditional styling
- **nanoid 5.1.6**: Room code generation

## Game Rules

1. Fill the 9x9 grid with numbers 1-9
2. Each row must contain all numbers 1-9
3. Each column must contain all numbers 1-9
4. Each 3x3 box must contain all numbers 1-9
5. No duplicates allowed in rows, columns, or boxes

## Controls

- **Click cell then number**: Select cell, then click number pad
- **Click number then cell**: Select number, then click cells
- **Pencil Mode**: Toggle to add/remove candidate notes
- **Clear**: Remove number from selected cell
- **Undo/Redo**: Navigate through move history
- **Hint**: Reveal one correct number
- **Solve**: Complete the puzzle automatically
- **Pause**: Pause/resume timer

## License

MIT
