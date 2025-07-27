/**
 * Core Game Engine implementing DSA concepts
 * Data Structures: Stack, Queue, Tree, Graph, Hash Table
 * Algorithms: DFS, BFS, Sorting, Pathfinding
 */

// Stack implementation for move history
class Stack {
    constructor() {
        this.items = [];
    }

    push(element) {
        this.items.push(element);
    }

    pop() {
        if (this.isEmpty()) return null;
        return this.items.pop();
    }

    peek() {
        if (this.isEmpty()) return null;
        return this.items[this.items.length - 1];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

    clear() {
        this.items = [];
    }
}

// Queue implementation for BFS
class Queue {
    constructor() {
        this.items = [];
    }

    enqueue(element) {
        this.items.push(element);
    }

    dequeue() {
        if (this.isEmpty()) return null;
        return this.items.shift();
    }

    front() {
        if (this.isEmpty()) return null;
        return this.items[0];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }
}

// Binary Tree Node for scoring system
class TreeNode {
    constructor(value, score) {
        this.value = value;
        this.score = score;
        this.left = null;
        this.right = null;
    }
}

// Binary Search Tree for high scores
class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(value, score) {
        const newNode = new TreeNode(value, score);
        
        if (!this.root) {
            this.root = newNode;
            return;
        }

        this.insertNode(this.root, newNode);
    }

    insertNode(node, newNode) {
        if (newNode.score < node.score) {
            if (node.left === null) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            if (node.right === null) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }

    inOrderTraversal(node = this.root, result = []) {
        if (node !== null) {
            this.inOrderTraversal(node.left, result);
            result.push({ value: node.value, score: node.score });
            this.inOrderTraversal(node.right, result);
        }
        return result;
    }

    getTopScores(limit = 10) {
        const scores = this.inOrderTraversal();
        return scores.sort((a, b) => b.score - a.score).slice(0, limit);
    }
}

// Graph implementation for card relationships
class Graph {
    constructor() {
        this.adjacencyList = new Map();
    }

    addVertex(vertex) {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, []);
        }
    }

    addEdge(vertex1, vertex2) {
        if (!this.adjacencyList.has(vertex1)) {
            this.addVertex(vertex1);
        }
        if (!this.adjacencyList.has(vertex2)) {
            this.addVertex(vertex2);
        }
        this.adjacencyList.get(vertex1).push(vertex2);
        this.adjacencyList.get(vertex2).push(vertex1);
    }

    getNeighbors(vertex) {
        return this.adjacencyList.get(vertex) || [];
    }

    // DFS to find connected components
    dfs(vertex, visited = new Set()) {
        visited.add(vertex);
        const component = [vertex];

        for (const neighbor of this.getNeighbors(vertex)) {
            if (!visited.has(neighbor)) {
                component.push(...this.dfs(neighbor, visited));
            }
        }

        return component;
    }

    // BFS for shortest path
    bfs(startVertex, targetVertex) {
        const queue = new Queue();
        const visited = new Set();
        const parent = new Map();

        queue.enqueue(startVertex);
        visited.add(startVertex);

        while (!queue.isEmpty()) {
            const current = queue.dequeue();

            if (current === targetVertex) {
                return this.reconstructPath(parent, startVertex, targetVertex);
            }

            for (const neighbor of this.getNeighbors(current)) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    parent.set(neighbor, current);
                    queue.enqueue(neighbor);
                }
            }
        }

        return null;
    }

    reconstructPath(parent, start, end) {
        const path = [];
        let current = end;

        while (current !== start) {
            path.unshift(current);
            current = parent.get(current);
        }

        path.unshift(start);
        return path;
    }
}

// Hash Table for quick card lookup
class HashTable {
    constructor(size = 53) {
        this.keyMap = new Array(size);
    }

    _hash(key) {
        let total = 0;
        let WEIRD_PRIME = 31;
        for (let i = 0; i < Math.min(key.length, 100); i++) {
            let char = key[i];
            let value = char.charCodeAt(0) - 96;
            total = (total * WEIRD_PRIME + value) % this.keyMap.length;
        }
        return total;
    }

    set(key, value) {
        let index = this._hash(key);
        if (!this.keyMap[index]) {
            this.keyMap[index] = [];
        }
        this.keyMap[index].push([key, value]);
    }

    get(key) {
        let index = this._hash(key);
        if (this.keyMap[index]) {
            for (let i = 0; i < this.keyMap[index].length; i++) {
                if (this.keyMap[index][i][0] === key) {
                    return this.keyMap[index][i][1];
                }
            }
        }
        return undefined;
    }
}

// Card class
class Card {
    constructor(id, symbol, isMatched = false) {
        this.id = id;
        this.symbol = symbol;
        this.isMatched = isMatched;
        this.isFlipped = false;
        this.position = null;
    }

    flip() {
        this.isFlipped = !this.isFlipped;
    }

    match() {
        this.isMatched = true;
    }
}

// Main Game Engine
class GameEngine {
    constructor(rows = 4, cols = 4) {
        this.rows = rows;
        this.cols = cols;
        this.totalCards = rows * cols;
        this.cards = [];
        this.moveHistory = new Stack();
        this.scoreTree = new BinarySearchTree();
        this.cardGraph = new Graph();
        this.cardHash = new HashTable();
        this.flippedCards = [];
        this.moves = 0;
        this.score = 0;
        this.gameState = 'playing'; // 'playing', 'won', 'lost'
        this.timer = 0;
        this.startTime = null;
        
        this.initializeGame();
    }

    initializeGame() {
        this.createCards();
        this.shuffleCards();
        this.buildCardGraph();
        this.startTime = Date.now();
    }

    createCards() {
        const symbols = ['♠', '♥', '♦', '♣', '★', '●', '▲', '■'];
        const pairs = Math.floor(this.totalCards / 2);
        
        for (let i = 0; i < pairs; i++) {
            const symbol = symbols[i % symbols.length];
            // Create two cards with the same symbol
            this.cards.push(new Card(i * 2, symbol));
            this.cards.push(new Card(i * 2 + 1, symbol));
        }
    }

    shuffleCards() {
        // Fisher-Yates shuffle algorithm
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }

        // Assign positions
        this.cards.forEach((card, index) => {
            card.position = {
                row: Math.floor(index / this.cols),
                col: index % this.cols
            };
            this.cardHash.set(`${card.position.row}-${card.position.col}`, card);
        });
    }

    buildCardGraph() {
        // Build graph representing card relationships
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const currentCard = this.getCardAt(row, col);
                if (currentCard) {
                    this.cardGraph.addVertex(currentCard.id);
                    
                    // Add edges to adjacent cards
                    const directions = [
                        [-1, 0], [1, 0], [0, -1], [0, 1] // up, down, left, right
                    ];
                    
                    directions.forEach(([dRow, dCol]) => {
                        const neighborCard = this.getCardAt(row + dRow, col + dCol);
                        if (neighborCard) {
                            this.cardGraph.addEdge(currentCard.id, neighborCard.id);
                        }
                    });
                }
            }
        }
    }

    getCardAt(row, col) {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            return null;
        }
        return this.cardHash.get(`${row}-${col}`);
    }

    flipCard(row, col) {
        // Check if coordinates are out of bounds
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            return { 
                success: false, 
                message: `Invalid card position: (${row}, ${col}). Valid range: row 0-${this.rows-1}, col 0-${this.cols-1}` 
            };
        }

        const card = this.getCardAt(row, col);

        if (!card) {
            return { success: false, message: 'Card not found at specified position' };
        }
        
        if (card.isMatched) {
            return { success: false, message: 'This card is already matched' };
        }
        
        if (card.isFlipped) {
            return { success: false, message: 'This card is already flipped' };
        }

        // Record move in history
        this.moveHistory.push({
            card: card,
            action: 'flip',
            timestamp: Date.now()
        });

        card.flip();
        this.flippedCards.push(card);
        this.moves++;

        // Check for match
        if (this.flippedCards.length === 2) {
            const [card1, card2] = this.flippedCards;
            
            if (card1.symbol === card2.symbol) {
                // Match found
                card1.match();
                card2.match();
                this.score += 10;
                this.flippedCards = [];
                
                // Check if game is won
                if (this.checkWinCondition()) {
                    this.endGame();
                }
            }
            // DO NOT flip back here!
        }

        return { success: true, card: card };
    }

    flipBackCards() {
        if (this.flippedCards.length === 2) {
            const [card1, card2] = this.flippedCards;
            card1.flip();
            card2.flip();
            this.flippedCards = [];
            return { success: true, message: 'Cards flipped back' };
        }
        return { success: false, message: 'No cards to flip back' };
    }

    checkWinCondition() {
        return this.cards.every(card => card.isMatched);
    }

    endGame() {
        this.gameState = 'won';
        this.timer = Date.now() - this.startTime;
        this.calculateFinalScore();
    }

    calculateFinalScore() {
        const timeBonus = Math.max(0, 1000 - Math.floor(this.timer / 1000));
        const moveBonus = Math.max(0, 50 - this.moves);
        this.score += timeBonus + moveBonus;
        
        // Add to high scores
        this.scoreTree.insert(`Player_${Date.now()}`, this.score);
    }

    undoMove() {
        const lastMove = this.moveHistory.pop();
        if (lastMove && lastMove.action === 'flip') {
            lastMove.card.flip();
            this.moves--;
            return { success: true, message: 'Move undone' };
        }
        return { success: false, message: 'No moves to undo' };
    }

    getGameState() {
        return {
            cards: this.cards.map(card => ({
                id: card.id,
                symbol: card.symbol,
                isFlipped: card.isFlipped,
                isMatched: card.isMatched,
                position: card.position
            })),
            moves: this.moves,
            score: this.score,
            gameState: this.gameState,
            timer: this.timer,
            flippedCards: this.flippedCards.length
        };
    }

    getHighScores() {
        return this.scoreTree.getTopScores();
    }

    // Algorithm implementations for analysis
    findShortestPath(startRow, startCol, endRow, endCol) {
        const startCard = this.getCardAt(startRow, startCol);
        const endCard = this.getCardAt(endRow, endCol);
        
        if (!startCard || !endCard) return null;
        
        return this.cardGraph.bfs(startCard.id, endCard.id);
    }

    getConnectedComponents() {
        const visited = new Set();
        const components = [];
        
        for (const card of this.cards) {
            if (!visited.has(card.id)) {
                const component = this.cardGraph.dfs(card.id, visited);
                components.push(component);
            }
        }
        
        return components;
    }

    // Sorting algorithms for card analysis
    sortCardsBySymbol() {
        return [...this.cards].sort((a, b) => a.symbol.localeCompare(b.symbol));
    }

    sortCardsByPosition() {
        return [...this.cards].sort((a, b) => {
            if (a.position.row !== b.position.row) {
                return a.position.row - b.position.row;
            }
            return a.position.col - b.position.col;
        });
    }
}

module.exports = {
    GameEngine,
    Stack,
    Queue,
    BinarySearchTree,
    Graph,
    HashTable,
    Card
}; 