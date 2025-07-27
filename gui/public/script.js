/**
 * Frontend JavaScript for Card Matching Game GUI
 * Handles game logic, API communication, and UI interactions
 */

class CardMatchingGame {
    constructor() {
        this.gameId = null;
        this.gameState = null;
        this.timer = null;
        this.timerInterval = null;
        this.startTime = null;
        this.isProcessing = false;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Setup screen
        document.getElementById('start-game-btn').addEventListener('click', () => this.startNewGame());
        
        // Game controls
        document.getElementById('new-game-btn').addEventListener('click', () => this.showSetupScreen());
        document.getElementById('undo-btn').addEventListener('click', () => this.undoMove());
        document.getElementById('hint-btn').addEventListener('click', () => this.getHint());
        document.getElementById('analysis-btn').addEventListener('click', () => this.showAnalysis());
        
        // Win screen
        document.getElementById('play-again-btn').addEventListener('click', () => this.showSetupScreen());
        document.getElementById('view-scores-btn').addEventListener('click', () => this.showHighScores());
        
        // Navigation
        document.getElementById('back-to-menu-btn').addEventListener('click', () => this.showSetupScreen());
        document.getElementById('back-to-game-btn').addEventListener('click', () => this.showGameScreen());
    }

    async startNewGame() {
        const rows = parseInt(document.getElementById('rows').value);
        const cols = parseInt(document.getElementById('cols').value);
        
        try {
            this.showLoading('Starting new game...');
            
            const response = await fetch(`/api/game/new?rows=${rows}&cols=${cols}`);
            const data = await response.json();
            
            if (response.ok) {
                this.gameId = data.gameId;
                this.gameState = data.gameState;
                this.startTime = Date.now();
                this.startTimer();
                this.renderGameBoard();
                this.showGameScreen();
                this.updateHeaderInfo();
            } else {
                this.showError('Failed to start new game');
            }
        } catch (error) {
            console.error('Error starting game:', error);
            this.showError('Failed to start new game');
        } finally {
            this.hideLoading();
        }
    }

    renderGameBoard() {
        const gameBoard = document.getElementById('game-board');
        const cols = this.gameState.cols || 4; // fallback to 4 if not present
        gameBoard.style.display = 'grid';
        gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        
        // Clear existing cards
        gameBoard.innerHTML = '';
        
        // Create cards
        this.gameState.cards.forEach((card, index) => {
            const cardElement = this.createCardElement(card, index);
            gameBoard.appendChild(cardElement);
        });
    }

    createCardElement(card, index) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.dataset.row = card.position.row;
        cardDiv.dataset.col = card.position.col;
        cardDiv.dataset.index = index;
        
        if (card.isMatched) {
            cardDiv.classList.add('matched');
        } else if (card.isFlipped) {
            cardDiv.classList.add('flipped');
        }
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'card-content';
        contentDiv.textContent = card.symbol;
        cardDiv.appendChild(contentDiv);
        
        // Add click event
        cardDiv.addEventListener('click', () => this.handleCardClick(card.position.row, card.position.col));
        
        return cardDiv;
    }

    async handleCardClick(row, col) {
        if (this.isProcessing) return;
        this.isProcessing = true;

        try {
            const response = await fetch(`/api/game/${this.gameId}/flip`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ row, col })
            });
            const data = await response.json();

            if (data.success) {
                // Optimistically show the new state immediately
                this.gameState = data.gameState;
                this.renderGameBoard();

                // Find currently flipped (but not matched) cards
                const flipped = this.gameState.cards.filter(card => card.isFlipped && !card.isMatched);

                if (flipped.length === 2) {
                    // Wait 1 second so the user can see both cards
                    setTimeout(async () => {
                        // Call the backend to flip back the cards
                        await fetch(`/api/game/${this.gameId}/flipback`, { method: 'POST' });
                        // Fetch the latest game state from backend
                        const stateResponse = await fetch(`/api/game/${this.gameId}/state`);
                        const stateData = await stateResponse.json();
                        this.gameState = stateData;
                        this.renderGameBoard();
                        this.isProcessing = false;
                    }, 1000);
                    return; // Don't set isProcessing to false yet
                }
            } else {
                this.showError(data.message);
            }
        } catch (error) {
            this.showError('Failed to flip card');
        } finally {
            // Only set isProcessing to false if not waiting for timeout
            if (this.isProcessing) this.isProcessing = false;
        }
    }

    async undoMove() {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        
        try {
            const response = await fetch(`/api/game/${this.gameId}/undo`, {
                method: 'POST'
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                this.gameState = data.gameState;
                this.renderGameBoard();
                this.updateHeaderInfo();
                this.showMessage('Move undone successfully', 'success');
            } else {
                this.showMessage(data.message || 'No moves to undo', 'error');
            }
        } catch (error) {
            console.error('Error undoing move:', error);
            this.showError('Failed to undo move');
        } finally {
            this.isProcessing = false;
        }
    }

    async getHint() {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        
        try {
            const response = await fetch(`/api/game/${this.gameId}/hint`);
            const data = await response.json();
            
            if (response.ok) {
                this.showHint(data.hint);
            } else {
                this.showError('Failed to get hint');
            }
        } catch (error) {
            console.error('Error getting hint:', error);
            this.showError('Failed to get hint');
        } finally {
            this.isProcessing = false;
        }
    }

    showHint(hint) {
        const hintDisplay = document.getElementById('hint-display');
        const hintText = document.getElementById('hint-text');
        
        hintText.textContent = hint.message;
        hintDisplay.classList.remove('hidden');
        
        // Highlight hint cards if available
        if (hint.cards && hint.cards.length > 0) {
            hint.cards.forEach(card => {
                const cardElement = document.querySelector(`[data-row="${card.row}"][data-col="${card.col}"]`);
                if (cardElement) {
                    cardElement.style.boxShadow = '0 0 20px #ffc107';
                    setTimeout(() => {
                        cardElement.style.boxShadow = '';
                    }, 3000);
                }
            });
        }
        
        // Hide hint after 5 seconds
        setTimeout(() => {
            hintDisplay.classList.add('hidden');
        }, 5000);
    }

    async showAnalysis() {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        
        try {
            const response = await fetch(`/api/game/${this.gameId}/analysis`);
            const data = await response.json();
            
            if (response.ok) {
                this.populateAnalysis(data);
                this.showAnalysisScreen();
            } else {
                this.showError('Failed to get analysis');
            }
        } catch (error) {
            console.error('Error getting analysis:', error);
            this.showError('Failed to get analysis');
        } finally {
            this.isProcessing = false;
        }
    }

    populateAnalysis(analysis) {
        // Stack analysis
        document.getElementById('stack-moves').textContent = analysis.stack.totalMoves;
        document.getElementById('stack-last').textContent = analysis.stack.hasLastMove ? 'Yes' : 'No';
        
        // Graph analysis
        document.getElementById('graph-components').textContent = analysis.graph.connectedComponents;
        document.getElementById('graph-largest').textContent = analysis.graph.largestComponent;
        
        // Hash table analysis
        document.getElementById('hash-cards').textContent = analysis.hashTable.totalCards;
        document.getElementById('hash-size').textContent = analysis.hashTable.tableSize;
        
        // Sorting analysis
        document.getElementById('sort-symbol').textContent = analysis.sorting.bySymbol;
        document.getElementById('sort-position').textContent = analysis.sorting.byPosition;
    }

    async showHighScores() {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        
        try {
            const response = await fetch(`/api/game/${this.gameId}/highscores`);
            const scores = await response.json();
            
            if (response.ok) {
                this.populateHighScores(scores);
                this.showScoresScreen();
            } else {
                this.showError('Failed to get high scores');
            }
        } catch (error) {
            console.error('Error getting high scores:', error);
            this.showError('Failed to get high scores');
        } finally {
            this.isProcessing = false;
        }
    }

    populateHighScores(scores) {
        const scoresList = document.getElementById('scores-list');
        scoresList.innerHTML = '';
        
        if (scores.length === 0) {
            scoresList.innerHTML = '<p style="text-align: center; color: #718096;">No high scores yet. Play a game to set some records!</p>';
            return;
        }
        
        scores.forEach((score, index) => {
            const scoreItem = document.createElement('div');
            scoreItem.className = `score-item ${index < 3 ? 'top-3' : ''}`;
            
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅';
            
            scoreItem.innerHTML = `
                <div class="score-rank">${medal}</div>
                <div class="score-details">
                    <div class="score-name">${score.value}</div>
                    <div class="score-value">${score.score} points</div>
                </div>
            `;
            
            scoresList.appendChild(scoreItem);
        });
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            if (this.startTime) {
                const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                document.getElementById('timer').textContent = `${elapsed}s`;
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateHeaderInfo() {
        document.getElementById('score').textContent = this.gameState.score;
        document.getElementById('moves').textContent = this.gameState.moves;
    }

    showSetupScreen() {
        this.hideAllScreens();
        document.getElementById('setup-screen').classList.add('active');
        this.stopTimer();
        this.gameId = null;
        this.gameState = null;
    }

    showGameScreen() {
        this.hideAllScreens();
        document.getElementById('game-screen').classList.add('active');
    }

    showWinScreen() {
        this.hideAllScreens();
        document.getElementById('win-screen').classList.add('active');
        
        // Populate win stats
        document.getElementById('final-score').textContent = this.gameState.score;
        document.getElementById('final-moves').textContent = this.gameState.moves;
        document.getElementById('final-time').textContent = `${Math.floor(this.gameState.timer / 1000)}s`;
    }

    showScoresScreen() {
        this.hideAllScreens();
        document.getElementById('scores-screen').classList.add('active');
    }

    showAnalysisScreen() {
        this.hideAllScreens();
        document.getElementById('analysis-screen').classList.add('active');
    }

    hideAllScreens() {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.remove('active'));
    }

    showLoading(message = 'Loading...') {
        // Create loading overlay if it doesn't exist
        let loadingOverlay = document.getElementById('loading-overlay');
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'loading-overlay';
            loadingOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                color: white;
                font-size: 1.2rem;
                font-weight: 600;
            `;
            document.body.appendChild(loadingOverlay);
        }
        
        loadingOverlay.innerHTML = `
            <div style="text-align: center;">
                <div class="loading" style="margin: 0 auto 1rem;"></div>
                <div>${message}</div>
            </div>
        `;
        loadingOverlay.style.display = 'flex';
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }

    showMessage(message, type = 'success') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        // Insert at the top of main content
        const main = document.querySelector('.main .container');
        main.insertBefore(messageDiv, main.firstChild);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    showError(message) {
        this.showMessage(message, 'error');
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CardMatchingGame();
});

// Add some utility functions for better UX
window.addEventListener('beforeunload', () => {
    // Clean up any ongoing timers or processes
    const game = window.cardGame;
    if (game && game.timerInterval) {
        clearInterval(game.timerInterval);
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (event) => {
    const game = window.cardGame;
    if (!game) return;
    
    switch (event.key) {
        case 'Escape':
            if (document.getElementById('game-screen').classList.contains('active')) {
                game.showSetupScreen();
            }
            break;
        case 'h':
        case 'H':
            if (document.getElementById('game-screen').classList.contains('active')) {
                game.getHint();
            }
            break;
        case 'u':
        case 'U':
            if (document.getElementById('game-screen').classList.contains('active')) {
                game.undoMove();
            }
            break;
    }
}); 