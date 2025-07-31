/**
 * Web Server for Card Matching Game GUI
 * Provides REST API endpoints and serves the web interface
 */

const express = require('express');
const path = require('path');
const { GameEngine } = require('../core/GameEngine');

class GameServer {
    constructor(port = 3000) {
        this.app = express();
        this.port = port;
        this.games = new Map(); // Store multiple game instances
        this.setupMiddleware();
        this.setupRoutes();
    }

    setupMiddleware() {
        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });
    }

    setupRoutes() {
        // API Routes
        this.app.get('/api/game/new', (req, res) => {
            const rows = parseInt(req.query.rows) || 4;
            const cols = parseInt(req.query.cols) || 4;
            const gameId = Date.now().toString();
            
            const game = new GameEngine(rows, cols);
            this.games.set(gameId, game);
            
            res.json({
                gameId: gameId,
                gameState: game.getGameState(),
                rows: rows,
                cols: cols
            });
        });

        this.app.get('/api/game/:gameId/state', (req, res) => {
            const gameId = req.params.gameId;
            const game = this.games.get(gameId);
            
            if (!game) {
                return res.status(404).json({ error: 'Game not found' });
            }
            
            res.json(game.getGameState());
        });

        this.app.post('/api/game/:gameId/flip', (req, res) => {
            const gameId = req.params.gameId;
            const { row, col } = req.body;
            const game = this.games.get(gameId);
            
            if (!game) {
                return res.status(404).json({ error: 'Game not found' });
            }
            
            const result = game.flipCard(row, col);
            res.json({
                success: result.success,
                message: result.message,
                gameState: game.getGameState()
            });
        });

        this.app.post('/api/game/:gameId/undo', (req, res) => {
            const gameId = req.params.gameId;
            const game = this.games.get(gameId);
            
            if (!game) {
                return res.status(404).json({ error: 'Game not found' });
            }
            
            const result = game.undoMove();
            res.json({
                success: result.success,
                message: result.message,
                gameState: game.getGameState()
            });
        });

        this.app.post('/api/game/:gameId/flipback', (req, res) => {
            const gameId = req.params.gameId;
            const game = this.games.get(gameId);
            if (!game) {
                return res.status(404).json({ error: 'Game not found' });
            }
            const result = game.flipBackCards();
            res.json({
                success: result.success,
                message: result.message,
                gameState: game.getGameState()
            });
        });

        this.app.get('/api/game/:gameId/hint', (req, res) => {
            const gameId = req.params.gameId;
            const game = this.games.get(gameId);
            
            if (!game) {
                return res.status(404).json({ error: 'Game not found' });
            }
            
            const hint = this.generateHint(game);
            res.json({ hint: hint });
        });

        this.app.get('/api/game/:gameId/analysis', (req, res) => {
            const gameId = req.params.gameId;
            const game = this.games.get(gameId);
            
            if (!game) {
                return res.status(404).json({ error: 'Game not found' });
            }
            
            const analysis = this.generateAnalysis(game);
            res.json(analysis);
        });

        this.app.get('/api/game/:gameId/highscores', (req, res) => {
            const gameId = req.params.gameId;
            const game = this.games.get(gameId);
            
            if (!game) {
                return res.status(404).json({ error: 'Game not found' });
            }
            
            res.json(game.getHighScores());
        });

        // Serve the main HTML page
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        });

        // Error handling
        this.app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({ error: 'Something went wrong!' });
        });
    }

    generateHint(game) {
        const unmatchedCards = game.cards.filter(card => !card.isMatched);
        if (unmatchedCards.length === 0) {
            return { message: "No hints needed - you've matched all cards!", cards: [] };
        }
        
        const symbolCounts = {};
        unmatchedCards.forEach(card => {
            symbolCounts[card.symbol] = (symbolCounts[card.symbol] || 0) + 1;
        });
        
        const availablePairs = Object.keys(symbolCounts).filter(symbol => symbolCounts[symbol] >= 2);
        
        if (availablePairs.length > 0) {
            const hintSymbol = availablePairs[0];
            const hintCards = unmatchedCards.filter(card => card.symbol === hintSymbol).slice(0, 2);
            
            return {
                message: `Look for the symbol "${hintSymbol}"`,
                symbol: hintSymbol,
                cards: hintCards.map(card => ({
                    row: card.position.row,
                    col: card.position.col
                }))
            };
        }
        
        return { message: "No obvious pairs found. Keep exploring!", cards: [] };
    }

    generateAnalysis(game) {
        const components = game.getConnectedComponents();
        const sortedBySymbol = game.sortCardsBySymbol();
        const sortedByPosition = game.sortCardsByPosition();
        
        return {
            stack: {
                totalMoves: game.moveHistory.size(),
                hasLastMove: game.moveHistory.peek() !== null
            },
            graph: {
                connectedComponents: components.length,
                largestComponent: Math.max(...components.map(c => c.length)),
                totalVertices: game.cards.length
            },
            hashTable: {
                totalCards: game.cards.length,
                tableSize: game.cardHash.keyMap.length
            },
            sorting: {
                bySymbol: sortedBySymbol.length,
                byPosition: sortedByPosition.length
            },
            algorithms: {
                cardLookup: "O(1) average",
                moveHistory: "O(1) push/pop",
                bfs: "O(V + E)",
                dfs: "O(V + E)",
                sorting: "O(n log n)"
            }
        };
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`🎮 Card Matching Game GUI Server running on http://localhost:${this.port}`);
            console.log(`📊 API endpoints available at http://localhost:${this.port}/api/`);
        });
    }
}

// Start the server if this file is run directly
if (require.main === module) {
    const server = new GameServer();
    server.start();
}

module.exports = GameServer; 