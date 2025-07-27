/**
 * Main Entry Point for Card Matching Game
 * Allows users to choose between CLI and GUI modes
 */

const readline = require('readline-sync');
const chalk = require('chalk');
const CLIInterface = require('./cli/cli');
const GameServer = require('./gui/server');

class GameLauncher {
    constructor() {
        this.running = true;
    }

    start() {
        console.clear();
        this.showWelcome();
        
        while (this.running) {
            this.showMenu();
            const choice = readline.question(chalk.cyan('Enter your choice: '));
            this.handleChoice(choice);
        }
    }

    showWelcome() {
        console.log(chalk.bold.blue('╔══════════════════════════════════════════════════════════════╗'));
        console.log(chalk.bold.blue('║                    CARD MATCHING GAME                       ║'));
        console.log(chalk.bold.blue('║                 DSA IMPLEMENTATION                          ║'));
        console.log(chalk.bold.blue('╚══════════════════════════════════════════════════════════════╝'));
        console.log(chalk.yellow('\n🎮 Welcome to the Card Matching Game!'));
        console.log(chalk.gray('This project demonstrates various Data Structures and Algorithms:'));
        console.log(chalk.gray('• Stack (Move History)'));
        console.log(chalk.gray('• Queue (BFS Algorithm)'));
        console.log(chalk.gray('• Binary Search Tree (High Scores)'));
        console.log(chalk.gray('• Graph (Card Relationships)'));
        console.log(chalk.gray('• Hash Table (Quick Card Lookup)'));
        console.log(chalk.gray('• DFS/BFS (Pathfinding)'));
        console.log(chalk.gray('• Sorting Algorithms'));
        console.log('');
    }

    showMenu() {
        console.log(chalk.cyan('\n📋 SELECT GAME MODE:'));
        console.log(chalk.white('1. 🖥️  Command Line Interface (CLI)'));
        console.log(chalk.white('2. 🌐 Web-based GUI'));
        console.log(chalk.white('3. 📖 View Project Information'));
        console.log(chalk.white('4. 🚪 Exit'));
        console.log('');
    }

    handleChoice(choice) {
        switch (choice) {
            case '1':
                this.startCLI();
                break;
            case '2':
                this.startGUI();
                break;
            case '3':
                this.showProjectInfo();
                break;
            case '4':
                this.exit();
                break;
            default:
                console.log(chalk.red('❌ Invalid choice. Please try again.'));
        }
    }

    startCLI() {
        console.clear();
        console.log(chalk.green('🎯 Starting CLI Mode...\n'));
        
        const cli = new CLIInterface();
        cli.start();
        
        // Return to main menu after CLI exits
        console.log(chalk.yellow('\n👋 Returning to main menu...'));
        setTimeout(() => {
            console.clear();
            this.showWelcome();
        }, 2000);
    }

    startGUI() {
        console.clear();
        console.log(chalk.green('🌐 Starting GUI Mode...\n'));
        console.log(chalk.yellow('Starting web server...'));
        
        const server = new GameServer();
        server.start();
        
        console.log(chalk.green('\n✅ GUI Server started successfully!'));
        console.log(chalk.cyan('🌐 Open your web browser and navigate to:'));
        console.log(chalk.bold.white('   http://localhost:3000'));
        console.log(chalk.gray('\nPress Ctrl+C to stop the server and return to main menu.'));
        
        // Handle graceful shutdown
        process.on('SIGINT', () => {
            console.log(chalk.yellow('\n\n🛑 Stopping GUI server...'));
            process.exit(0);
        });
    }

    showProjectInfo() {
        console.clear();
        console.log(chalk.bold.blue('╔══════════════════════════════════════════════════════════════╗'));
        console.log(chalk.bold.blue('║                    PROJECT INFORMATION                      ║'));
        console.log(chalk.bold.blue('╚══════════════════════════════════════════════════════════════╝'));
        
        console.log(chalk.green('\n📚 PROJECT OVERVIEW:'));
        console.log(chalk.white('A comprehensive card matching game that demonstrates various'));
        console.log(chalk.white('Data Structures and Algorithms concepts using JavaScript.'));
        
        console.log(chalk.green('\n🔧 TECHNOLOGIES USED:'));
        console.log(chalk.white('• Node.js - Runtime environment'));
        console.log(chalk.white('• JavaScript (ES6+) - Programming language'));
        console.log(chalk.white('• Express.js - Web server framework'));
        console.log(chalk.white('• HTML5/CSS3 - Frontend markup and styling'));
        console.log(chalk.white('• Font Awesome - Icons'));
        console.log(chalk.white('• Chalk - CLI colorization'));
        console.log(chalk.white('• Readline-sync - CLI input handling'));
        
        console.log(chalk.green('\n📊 DATA STRUCTURES IMPLEMENTED:'));
        console.log(chalk.white('• Stack - Move history and undo functionality'));
        console.log(chalk.white('• Queue - BFS algorithm for pathfinding'));
        console.log(chalk.white('• Binary Search Tree - High score management'));
        console.log(chalk.white('• Graph - Card relationship modeling'));
        console.log(chalk.white('• Hash Table - O(1) card lookup'));
        
        console.log(chalk.green('\n⚡ ALGORITHMS IMPLEMENTED:'));
        console.log(chalk.white('• Depth-First Search (DFS) - Connected components'));
        console.log(chalk.white('• Breadth-First Search (BFS) - Shortest path'));
        console.log(chalk.white('• Fisher-Yates Shuffle - Card randomization'));
        console.log(chalk.white('• Sorting Algorithms - Card organization'));
        
        console.log(chalk.green('\n🎮 GAME FEATURES:'));
        console.log(chalk.white('• Multiple difficulty levels (3x3 to 6x6 grids)'));
        console.log(chalk.white('• Move history with undo functionality'));
        console.log(chalk.white('• Hint system using graph analysis'));
        console.log(chalk.white('• Real-time scoring and timing'));
        console.log(chalk.white('• High score tracking'));
        console.log(chalk.white('• DSA analysis and visualization'));
        console.log(chalk.white('• Responsive design for all devices'));
        
        console.log(chalk.green('\n📁 PROJECT STRUCTURE:'));
        console.log(chalk.white('card-matching-game/'));
        console.log(chalk.gray('├── core/'));
        console.log(chalk.gray('│   └── GameEngine.js          # Core game logic and DSA implementations'));
        console.log(chalk.gray('├── cli/'));
        console.log(chalk.gray('│   └── cli.js                 # Command-line interface'));
        console.log(chalk.gray('├── gui/'));
        console.log(chalk.gray('│   ├── server.js              # Express web server'));
        console.log(chalk.gray('│   └── public/'));
        console.log(chalk.gray('│       ├── index.html         # Main HTML page'));
        console.log(chalk.gray('│       ├── styles.css         # CSS styling'));
        console.log(chalk.gray('│       └── script.js          # Frontend JavaScript'));
        console.log(chalk.gray('├── package.json               # Project dependencies'));
        console.log(chalk.gray('├── README.md                  # Project documentation'));
        console.log(chalk.gray('└── index.js                   # Main entry point'));
        
        console.log(chalk.green('\n🚀 GETTING STARTED:'));
        console.log(chalk.white('1. Install dependencies: npm install'));
        console.log(chalk.white('2. Run CLI mode: npm run cli'));
        console.log(chalk.white('3. Run GUI mode: npm run gui'));
        console.log(chalk.white('4. Or use main launcher: npm start'));
        
        console.log(chalk.gray('\nPress Enter to return to main menu...'));
        readline.question('');
    }

    exit() {
        console.log(chalk.yellow('\n👋 Thanks for playing! Goodbye!'));
        this.running = false;
    }
}

// Start the launcher if this file is run directly
if (require.main === module) {
    const launcher = new GameLauncher();
    launcher.start();
}

module.exports = GameLauncher; 