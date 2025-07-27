/**
 * CLI Interface for Card Matching Game
 * Implements interactive command-line interface with colorful output
 */

const readline = require('readline-sync');
const chalk = require('chalk');
const { GameEngine } = require('../core/GameEngine');

class CLIInterface {
    constructor() {
        this.game = null;
        this.running = true;
    }

    start() {
        console.clear();
        this.showWelcome();
        
        while (this.running) {
            this.showMainMenu();
            const choice = readline.question(chalk.cyan('Enter your choice: '));
            this.handleMainMenuChoice(choice);
        }
    }

    showWelcome() {
        console.log(chalk.bold.blue('╔══════════════════════════════════════════════════════════════╗'));
        console.log(chalk.bold.blue('║                    CARD MATCHING GAME                       ║'));
        console.log(chalk.bold.blue('║                     CLI VERSION                             ║'));
        console.log(chalk.bold.blue('╚══════════════════════════════════════════════════════════════╝'));
        console.log(chalk.yellow('\n🎮 Welcome to the Card Matching Game!'));
        console.log(chalk.gray('This game demonstrates various Data Structures and Algorithms:'));
        console.log(chalk.gray('• Stack (Move History)'));
        console.log(chalk.gray('• Queue (BFS Algorithm)'));
        console.log(chalk.gray('• Binary Search Tree (High Scores)'));
        console.log(chalk.gray('• Graph (Card Relationships)'));
        console.log(chalk.gray('• Hash Table (Quick Card Lookup)'));
        console.log(chalk.gray('• DFS/BFS (Pathfinding)'));
        console.log(chalk.gray('• Sorting Algorithms'));
        console.log('');
    }

    showMainMenu() {
        console.log(chalk.cyan('\n📋 MAIN MENU:'));
        console.log(chalk.white('1. 🎯 Start New Game'));
        console.log(chalk.white('2. 🏆 View High Scores'));
        console.log(chalk.white('3. 📊 DSA Analysis'));
        console.log(chalk.white('4. ❓ How to Play'));
        console.log(chalk.white('5. 🚪 Exit'));
        console.log('');
    }

    handleMainMenuChoice(choice) {
        switch (choice) {
            case '1':
                this.startNewGame();
                break;
            case '2':
                this.showHighScores();
                break;
            case '3':
                this.showDSAAnalysis();
                break;
            case '4':
                this.showHowToPlay();
                break;
            case '5':
                this.exit();
                break;
            default:
                console.log(chalk.red('❌ Invalid choice. Please try again.'));
        }
    }

    startNewGame() {
        console.clear();
        console.log(chalk.green('🎯 Starting New Game...\n'));
        
        // Get game configuration
        const rows = parseInt(readline.question(chalk.yellow('Enter number of rows (default 4): ')) || '4');
        const cols = parseInt(readline.question(chalk.yellow('Enter number of columns (default 4): ')) || '4');
        
        this.game = new GameEngine(rows, cols);
        this.playGame();
    }

    playGame() {
        while (this.game.gameState === 'playing') {
            this.displayGame();
            this.showGameMenu();
            const choice = readline.question(chalk.cyan('Enter your choice: '));
            this.handleGameChoice(choice);
        }

        if (this.game.gameState === 'won') {
            this.showWinScreen();
        }
    }

    displayGame() {
        console.clear();
        console.log(chalk.bold.blue('╔══════════════════════════════════════════════════════════════╗'));
        console.log(chalk.bold.blue('║                         GAME BOARD                           ║'));
        console.log(chalk.bold.blue('╚══════════════════════════════════════════════════════════════╝'));
        
        // Display score and moves
        const gameState = this.game.getGameState();
        console.log(chalk.green(`\n🏆 Score: ${gameState.score} | 🎯 Moves: ${gameState.moves} | ⏱️  Time: ${Math.floor(gameState.timer / 1000)}s`));
        
        // Display column numbers
        let colHeader = '    ';
        for (let col = 0; col < this.game.cols; col++) {
            colHeader += `  ${col} `;
        }
        console.log(chalk.yellow(colHeader));
        
        // Display game board
        for (let row = 0; row < this.game.rows; row++) {
            let rowDisplay = chalk.yellow(` ${row} `);
            for (let col = 0; col < this.game.cols; col++) {
                const card = this.game.getCardAt(row, col);
                if (card) {
                    if (card.isMatched) {
                        rowDisplay += chalk.green(' [✓] ');
                    } else if (card.isFlipped) {
                        rowDisplay += chalk.blue(` [${card.symbol}] `);
                    } else {
                        rowDisplay += chalk.gray(' [ ] ');
                    }
                }
            }
            console.log(rowDisplay);
        }
        console.log('');
    }

    showGameMenu() {
        console.log(chalk.cyan('🎮 GAME OPTIONS:'));
        console.log(chalk.white('• Enter row and column (e.g., "2 3") to flip a card'));
        console.log(chalk.white('• Type "undo" to undo last move'));
        console.log(chalk.white('• Type "hint" to get a hint'));
        console.log(chalk.white('• Type "quit" to quit game'));
        console.log('');
    }

    handleGameChoice(choice) {
        if (choice.toLowerCase() === 'quit') {
            this.game.gameState = 'lost';
            return;
        }
        
        if (choice.toLowerCase() === 'undo') {
            const result = this.game.undoMove();
            if (result.success) {
                console.log(chalk.green('✅ ' + result.message));
            } else {
                console.log(chalk.red('❌ ' + result.message));
            }
            return;
        }
        
        if (choice.toLowerCase() === 'hint') {
            this.showHint();
            return;
        }
        
        // Parse row and column
        const coords = choice.trim().split(/\s+/);
        if (coords.length === 2) {
            const row = parseInt(coords[0]);
            const col = parseInt(coords[1]);
            
            if (isNaN(row) || isNaN(col)) {
                console.log(chalk.red('❌ Invalid coordinates. Use format: "row column"'));
                console.log(chalk.yellow(`Valid range: row 0-${this.game.rows-1}, col 0-${this.game.cols-1}`));
                return;
            }
            
            const result = this.game.flipCard(row, col);
            if (result.success) {
                console.log(chalk.green(`✅ Flipped card at (${row}, ${col}): ${result.card.symbol}`));
                
                // Check if we have two flipped cards (potential match)
                if (this.game.flippedCards.length === 2) {
                    // Show the current state with both cards flipped
                    this.displayGame();
                    
                    const [card1, card2] = this.game.flippedCards;
                    if (card1.symbol === card2.symbol) {
                        // Match found - cards stay flipped
                        console.log(chalk.green(`🎉 Match found! Both ${card1.symbol} cards are now matched!`));
                        this.game.flippedCards = []; // Clear the flipped cards array
                    } else {
                        // No match - show cards briefly then flip back
                        console.log(chalk.red(`❌ No match! ${card1.symbol} and ${card2.symbol} don't match.`));
                        console.log(chalk.yellow('Cards will flip back in 2 seconds...'));
                        this.waitForTimeout(2000);
                        this.game.flipBackCards();
                        this.displayGame();
                    }
                }
            } else {
                console.log(chalk.red('❌ ' + result.message));
                this.waitForTimeout(2000);
            }
        } else {
            console.log(chalk.red('❌ Invalid input. Use format: "row column"'));
            if (this.game) {
                console.log(chalk.yellow(`Valid range: row 0-${this.game.rows-1}, col 0-${this.game.cols-1}`));
            }
        }
    }

    waitForTimeout(ms) {
        const start = Date.now();
        while (Date.now() - start < ms) {
            // Busy wait - this is not ideal but works for CLI
            // In a real application, you'd use async/await or callbacks
        }
    }

    showHint() {
        const unmatchedCards = this.game.cards.filter(card => !card.isMatched);
        if (unmatchedCards.length === 0) {
            console.log(chalk.yellow('🎉 No hints needed - you\'ve matched all cards!'));
            return;
        }
        
        // Find a pair of unmatched cards with the same symbol
        const symbolCounts = {};
        unmatchedCards.forEach(card => {
            symbolCounts[card.symbol] = (symbolCounts[card.symbol] || 0) + 1;
        });
        
        const availablePairs = Object.keys(symbolCounts).filter(symbol => symbolCounts[symbol] >= 2);
        
        if (availablePairs.length > 0) {
            const hintSymbol = availablePairs[0];
            const hintCards = unmatchedCards.filter(card => card.symbol === hintSymbol).slice(0, 2);
            
            console.log(chalk.yellow(`💡 Hint: Look for the symbol "${hintSymbol}" at positions:`));
            hintCards.forEach(card => {
                console.log(chalk.yellow(`   (${card.position.row}, ${card.position.col})`));
            });
        } else {
            console.log(chalk.yellow('💡 No obvious pairs found. Keep exploring!'));
        }
    }

    showWinScreen() {
        console.clear();
        console.log(chalk.bold.green('╔══════════════════════════════════════════════════════════════╗'));
        console.log(chalk.bold.green('║                        🎉 YOU WIN! 🎉                       ║'));
        console.log(chalk.bold.green('╚══════════════════════════════════════════════════════════════╝'));
        
        const gameState = this.game.getGameState();
        console.log(chalk.green(`\n🏆 Final Score: ${gameState.score}`));
        console.log(chalk.green(`🎯 Total Moves: ${gameState.moves}`));
        console.log(chalk.green(`⏱️  Time Taken: ${Math.floor(gameState.timer / 1000)} seconds`));
        
        console.log(chalk.yellow('\n🎊 Congratulations! You\'ve successfully matched all the cards!'));
        console.log(chalk.gray('\nPress Enter to continue...'));
        readline.question('');
    }

    showHighScores() {
        console.clear();
        console.log(chalk.bold.blue('╔══════════════════════════════════════════════════════════════╗'));
        console.log(chalk.bold.blue('║                       HIGH SCORES                           ║'));
        console.log(chalk.bold.blue('╚══════════════════════════════════════════════════════════════╝'));
        
        const highScores = this.game ? this.game.getHighScores() : [];
        
        if (highScores.length === 0) {
            console.log(chalk.yellow('\n📊 No high scores yet. Play a game to set some records!'));
        } else {
            console.log(chalk.green('\n🏆 TOP SCORES:'));
            highScores.forEach((score, index) => {
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅';
                console.log(chalk.white(`${medal} ${score.value}: ${score.score} points`));
            });
        }
        
        console.log(chalk.gray('\nPress Enter to continue...'));
        readline.question('');
    }

    showDSAAnalysis() {
        console.clear();
        console.log(chalk.bold.blue('╔══════════════════════════════════════════════════════════════╗'));
        console.log(chalk.bold.blue('║                    DSA ANALYSIS                             ║'));
        console.log(chalk.bold.blue('╚══════════════════════════════════════════════════════════════╝'));
        
        if (!this.game) {
            console.log(chalk.yellow('\n📊 Start a game first to see DSA analysis!'));
            console.log(chalk.gray('\nPress Enter to continue...'));
            readline.question('');
            return;
        }
        
        console.log(chalk.green('\n🔍 DATA STRUCTURES ANALYSIS:'));
        
        // Stack analysis
        console.log(chalk.cyan('\n📚 Stack (Move History):'));
        console.log(chalk.white(`   • Total moves recorded: ${this.game.moveHistory.size()}`));
        console.log(chalk.white(`   • Last move: ${this.game.moveHistory.peek() ? 'Available' : 'None'}`));
        
        // Graph analysis
        console.log(chalk.cyan('\n🕸️  Graph (Card Relationships):'));
        const components = this.game.getConnectedComponents();
        console.log(chalk.white(`   • Connected components: ${components.length}`));
        console.log(chalk.white(`   • Largest component size: ${Math.max(...components.map(c => c.length))}`));
        
        // Hash table analysis
        console.log(chalk.cyan('\n🗂️  Hash Table (Card Lookup):'));
        console.log(chalk.white(`   • Total cards stored: ${this.game.cards.length}`));
        console.log(chalk.white(`   • Hash table size: ${this.game.cardHash.keyMap.length}`));
        
        // Sorting analysis
        console.log(chalk.cyan('\n📊 Sorting Analysis:'));
        const sortedBySymbol = this.game.sortCardsBySymbol();
        const sortedByPosition = this.game.sortCardsByPosition();
        console.log(chalk.white(`   • Cards sorted by symbol: ${sortedBySymbol.length} items`));
        console.log(chalk.white(`   • Cards sorted by position: ${sortedByPosition.length} items`));
        
        // Algorithm complexity
        console.log(chalk.cyan('\n⚡ Algorithm Complexity:'));
        console.log(chalk.white('   • Card lookup: O(1) average (Hash Table)'));
        console.log(chalk.white('   • Move history: O(1) push/pop (Stack)'));
        console.log(chalk.white('   • BFS pathfinding: O(V + E)'));
        console.log(chalk.white('   • DFS components: O(V + E)'));
        console.log(chalk.white('   • Sorting: O(n log n)'));
        
        console.log(chalk.gray('\nPress Enter to continue...'));
        readline.question('');
    }

    showHowToPlay() {
        console.clear();
        console.log(chalk.bold.blue('╔══════════════════════════════════════════════════════════════╗'));
        console.log(chalk.bold.blue('║                      HOW TO PLAY                            ║'));
        console.log(chalk.bold.blue('╚══════════════════════════════════════════════════════════════╝'));
        
        console.log(chalk.green('\n🎮 GAME OBJECTIVE:'));
        console.log(chalk.white('Match all pairs of cards by flipping them over. Find two cards with'));
        console.log(chalk.white('the same symbol to make a match.'));
        
        console.log(chalk.green('\n🎯 HOW TO PLAY:'));
        console.log(chalk.white('1. Enter row and column coordinates (e.g., "2 3") to flip a card'));
        console.log(chalk.white('2. Find the matching pair for the flipped card'));
        console.log(chalk.white('3. Continue until all pairs are matched'));
        console.log(chalk.white('4. Try to complete the game with the fewest moves and fastest time'));
        
        console.log(chalk.green('\n🎨 GAME SYMBOLS:'));
        console.log(chalk.white('   [ ] - Hidden card'));
        console.log(chalk.blue('   [♠] - Flipped card (shows symbol)'));
        console.log(chalk.green('   [✓] - Matched card'));
        
        console.log(chalk.green('\n🏆 SCORING:'));
        console.log(chalk.white('• +10 points for each match'));
        console.log(chalk.white('• Time bonus: +1000 - seconds taken'));
        console.log(chalk.white('• Move bonus: +50 - total moves'));
        
        console.log(chalk.green('\n💡 COMMANDS:'));
        console.log(chalk.white('• "row column" - Flip card at position'));
        console.log(chalk.white('• "undo" - Undo last move'));
        console.log(chalk.white('• "hint" - Get a hint'));
        console.log(chalk.white('• "quit" - Quit current game'));
        
        console.log(chalk.gray('\nPress Enter to continue...'));
        readline.question('');
    }

    exit() {
        console.log(chalk.yellow('\n👋 Thanks for playing! Goodbye!'));
        this.running = false;
    }
}

// Start the CLI if this file is run directly
if (require.main === module) {
    const cli = new CLIInterface();
    cli.start();
}

module.exports = CLIInterface; 