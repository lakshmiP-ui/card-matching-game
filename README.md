# 🎮 Card Matching Game - DSA Edition

A comprehensive card matching game that demonstrates various **Data Structures and Algorithms** concepts using JavaScript. The game is implemented in both **Command Line Interface (CLI)** and **Web-based GUI** modes.

![Game Preview](https://img.shields.io/badge/Status-Complete-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![Express](https://img.shields.io/badge/Express-4.18+-blue)

## 📚 Table of Contents

- [Features](#-features)
- [Data Structures & Algorithms](#-data-structures--algorithms)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Game Rules](#-game-rules)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🎯 Core Game Features
- **Multiple Difficulty Levels**: 3x3 to 6x6 grid configurations
- **Move History**: Undo functionality with stack implementation
- **Hint System**: Intelligent hints using graph analysis
- **Real-time Scoring**: Dynamic scoring with time and move bonuses
- **High Score Tracking**: Persistent high scores using BST
- **Timer**: Real-time game timer
- **Responsive Design**: Works on desktop, tablet, and mobile

### 🖥️ CLI Mode
- **Interactive Terminal Interface**: Colorful, user-friendly CLI
- **Keyboard Navigation**: Easy-to-use menu system
- **Real-time Updates**: Live game state display
- **DSA Analysis**: In-depth data structure analysis
- **Cross-platform**: Works on Windows, macOS, and Linux

### 🌐 GUI Mode
- **Modern Web Interface**: Beautiful, responsive web design
- **Smooth Animations**: Card flip animations and transitions
- **Real-time Updates**: Live score and timer updates
- **Interactive Elements**: Click-to-flip cards with visual feedback
- **Mobile Responsive**: Optimized for all screen sizes

## 📊 Data Structures & Algorithms

### Data Structures Implemented

| Structure | Purpose | Implementation |
|-----------|---------|----------------|
| **Stack** | Move History | Array-based LIFO structure for undo functionality |
| **Queue** | BFS Algorithm | Array-based FIFO structure for breadth-first search |
| **Binary Search Tree** | High Scores | Self-balancing tree for efficient score management |
| **Graph** | Card Relationships | Adjacency list representation for card connections |
| **Hash Table** | Card Lookup | O(1) average time complexity for card retrieval |

### Algorithms Implemented

| Algorithm | Purpose | Time Complexity |
|-----------|---------|-----------------|
| **Depth-First Search (DFS)** | Connected Components | O(V + E) |
| **Breadth-First Search (BFS)** | Shortest Path | O(V + E) |
| **Fisher-Yates Shuffle** | Card Randomization | O(n) |
| **Quick Sort** | Card Sorting | O(n log n) average |
| **Binary Search** | Score Lookup | O(log n) |

### Complexity Analysis

```javascript
// Card Lookup (Hash Table)
getCardAt(row, col) // O(1) average

// Move History (Stack)
push(move)  // O(1)
pop()       // O(1)
undo()      // O(1)

// Pathfinding (BFS)
findShortestPath() // O(V + E)

// Connected Components (DFS)
getConnectedComponents() // O(V + E)

// High Score Management (BST)
insert(score)     // O(log n)
getTopScores()    // O(n log n)
```

## 🚀 Installation

### Prerequisites
- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)

### Setup Instructions

1. **Clone or Download the Project**
   ```bash
   git clone <repository-url>
   cd card-matching-game
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Verify Installation**
   ```bash
   node --version  # Should be 18+
   npm --version   # Should be 8+
   ```

## 🎮 Usage

### Main Launcher (Recommended)
```bash
npm start
```
This launches the main menu where you can choose between CLI and GUI modes.

### CLI Mode Only
```bash
npm run cli
```
Starts the command-line interface directly.

### GUI Mode Only
```bash
npm run gui
```
Starts the web server and opens the GUI in your browser at `http://localhost:3000`.

### Development
```bash
npm test
```
Runs the test suite (if available).

## 📁 Project Structure

```
card-matching-game/
├── core/
│   └── GameEngine.js          # Core game logic and DSA implementations
├── cli/
│   └── cli.js                 # Command-line interface
├── gui/
│   ├── server.js              # Express web server
│   └── public/
│       ├── index.html         # Main HTML page
│       ├── styles.css         # CSS styling
│       └── script.js          # Frontend JavaScript
├── package.json               # Project dependencies
├── README.md                  # Project documentation
└── index.js                   # Main entry point
```

### Core Components

#### `core/GameEngine.js`
- **GameEngine Class**: Main game logic
- **Stack Class**: Move history implementation
- **Queue Class**: BFS algorithm implementation
- **BinarySearchTree Class**: High score management
- **Graph Class**: Card relationship modeling
- **HashTable Class**: O(1) card lookup
- **Card Class**: Individual card representation

#### `cli/cli.js`
- **CLIInterface Class**: Terminal-based user interface
- **Interactive Menus**: Game setup and navigation
- **Real-time Display**: Live game board updates
- **DSA Analysis**: Data structure visualization

#### `gui/server.js`
- **GameServer Class**: Express.js web server
- **REST API**: Game state management endpoints
- **Static File Serving**: HTML, CSS, and JavaScript files
- **Multi-game Support**: Multiple concurrent games

#### `gui/public/`
- **index.html**: Main web page structure
- **styles.css**: Modern, responsive CSS styling
- **script.js**: Frontend game logic and API communication

## 🎯 Game Rules

### Objective
Match all pairs of cards by finding two cards with the same symbol.

### How to Play
1. **Setup**: Choose grid size (3x3 to 6x6)
2. **Flip Cards**: Click/tap cards to reveal their symbols
3. **Find Matches**: Locate pairs of cards with identical symbols
4. **Complete**: Match all pairs to win the game

### Scoring System
- **Base Score**: +10 points per match
- **Time Bonus**: +1000 - seconds taken
- **Move Bonus**: +50 - total moves made
- **Final Score**: Base + Time Bonus + Move Bonus

### Controls

#### CLI Mode
- **Card Selection**: Enter row and column (e.g., "2 3")
- **Undo**: Type "undo" to reverse last move
- **Hint**: Type "hint" for assistance
- **Quit**: Type "quit" to exit game

#### GUI Mode
- **Card Selection**: Click/tap cards
- **Undo**: Click "Undo" button or press 'U'
- **Hint**: Click "Hint" button or press 'H'
- **New Game**: Click "New Game" button
- **Analysis**: Click "DSA Analysis" button

## 🔌 API Documentation

### REST Endpoints

#### Create New Game
```http
GET /api/game/new?rows=4&cols=4
```
**Response:**
```json
{
  "gameId": "1234567890",
  "gameState": { /* game state object */ },
  "rows": 4,
  "cols": 4
}
```

#### Get Game State
```http
GET /api/game/{gameId}/state
```
**Response:**
```json
{
  "cards": [ /* array of card objects */ ],
  "moves": 5,
  "score": 120,
  "gameState": "playing",
  "timer": 30000,
  "flippedCards": 1
}
```

#### Flip Card
```http
POST /api/game/{gameId}/flip
Content-Type: application/json

{
  "row": 2,
  "col": 3
}
```
**Response:**
```json
{
  "success": true,
  "message": "Card flipped successfully",
  "gameState": { /* updated game state */ }
}
```

#### Undo Move
```http
POST /api/game/{gameId}/undo
```
**Response:**
```json
{
  "success": true,
  "message": "Move undone",
  "gameState": { /* updated game state */ }
}
```

#### Get Hint
```http
GET /api/game/{gameId}/hint
```
**Response:**
```json
{
  "hint": {
    "message": "Look for the symbol ♠",
    "symbol": "♠",
    "cards": [
      { "row": 1, "col": 2 },
      { "row": 3, "col": 1 }
    ]
  }
}
```

#### Get DSA Analysis
```http
GET /api/game/{gameId}/analysis
```
**Response:**
```json
{
  "stack": {
    "totalMoves": 10,
    "hasLastMove": true
  },
  "graph": {
    "connectedComponents": 3,
    "largestComponent": 8,
    "totalVertices": 16
  },
  "hashTable": {
    "totalCards": 16,
    "tableSize": 53
  },
  "sorting": {
    "bySymbol": 16,
    "byPosition": 16
  },
  "algorithms": {
    "cardLookup": "O(1) average",
    "moveHistory": "O(1) push/pop",
    "bfs": "O(V + E)",
    "dfs": "O(V + E)",
    "sorting": "O(n log n)"
  }
}
```

#### Get High Scores
```http
GET /api/game/{gameId}/highscores
```
**Response:**
```json
[
  { "value": "Player_123", "score": 1500 },
  { "value": "Player_456", "score": 1200 },
  { "value": "Player_789", "score": 1000 }
]
```

## 🛠️ Development

### Adding New Features

1. **Core Logic**: Extend `GameEngine.js` with new data structures
2. **CLI Interface**: Update `cli.js` for new functionality
3. **GUI Interface**: Modify `server.js` and frontend files
4. **Testing**: Add tests for new features

### Code Style
- Use **ES6+** JavaScript features
- Follow **camelCase** naming convention
- Add **JSDoc** comments for functions
- Maintain **modular** code structure

### Performance Considerations
- **Hash Table**: O(1) card lookup for optimal performance
- **Stack**: O(1) push/pop for move history
- **BST**: O(log n) insert for high scores
- **Graph**: Efficient adjacency list representation

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Contribution Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure cross-platform compatibility

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Node.js** community for the excellent runtime
- **Express.js** team for the web framework
- **Font Awesome** for the beautiful icons
- **Chalk** library for CLI colorization
- **Inter** font family for typography

## 📞 Support

If you encounter any issues or have questions:

1. **Check** the documentation above
2. **Search** existing issues
3. **Create** a new issue with detailed information
4. **Contact** the maintainers

---

**Happy Coding! 🎮✨**

*Built with ❤️ using JavaScript and modern web technologies* 