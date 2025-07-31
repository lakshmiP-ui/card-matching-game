/**
 * Simple Test File for Card Matching Game
 * Demonstrates core functionality without external dependencies
 */

const { GameEngine } = require('./core/GameEngine');

console.log('🎮 Card Matching Game - DSA Edition');
console.log('=====================================\n');

// Test the game engine
function testGameEngine() {
    console.log('🧪 Testing Game Engine...\n');
    
    // Create a 4x4 game
    const game = new GameEngine(4, 4);
    
    console.log('📊 Initial Game State:');
    console.log(`- Grid Size: ${game.rows}x${game.cols}`);
    console.log(`- Total Cards: ${game.cards.length}`);
    console.log(`- Score: ${game.score}`);
    console.log(`- Moves: ${game.moves}`);
    console.log(`- Game State: ${game.gameState}\n`);
    
    // Display the game board
    console.log('🎯 Game Board:');
    for (let row = 0; row < game.rows; row++) {
        let rowDisplay = '';
        for (let col = 0; col < game.cols; col++) {
            const card = game.getCardAt(row, col);
            if (card.isMatched) {
                rowDisplay += '[✓] ';
            } else if (card.isFlipped) {
                rowDisplay += `[${card.symbol}] `;
            } else {
                rowDisplay += '[ ] ';
            }
        }
        console.log(`Row ${row}: ${rowDisplay}`);
    }
    console.log('');
    
    // Test some moves
    console.log('🎮 Testing Game Moves...\n');
    
    // Flip first card
    console.log('1. Flipping card at (0, 0)...');
    const result1 = game.flipCard(0, 0);
    console.log(`   Result: ${result1.success ? 'Success' : 'Failed'} - ${result1.message}`);
    if (result1.success) {
        console.log(`   Card Symbol: ${result1.card.symbol}`);
    }
    
    // Flip second card
    console.log('2. Flipping card at (0, 1)...');
    const result2 = game.flipCard(0, 1);
    console.log(`   Result: ${result2.success ? 'Success' : 'Failed'} - ${result2.message}`);
    if (result2.success) {
        console.log(`   Card Symbol: ${result2.card.symbol}`);
    }
    
    // Display updated board
    console.log('\n📊 Updated Game Board:');
    for (let row = 0; row < game.rows; row++) {
        let rowDisplay = '';
        for (let col = 0; col < game.cols; col++) {
            const card = game.getCardAt(row, col);
            if (card.isMatched) {
                rowDisplay += '[✓] ';
            } else if (card.isFlipped) {
                rowDisplay += `[${card.symbol}] `;
            } else {
                rowDisplay += '[ ] ';
            }
        }
        console.log(`Row ${row}: ${rowDisplay}`);
    }
    console.log('');
    
    // Test DSA features
    console.log('🔍 Testing DSA Features...\n');
    
    // Stack analysis
    console.log('📚 Stack (Move History):');
    console.log(`   - Total moves recorded: ${game.moveHistory.size()}`);
    console.log(`   - Last move available: ${game.moveHistory.peek() ? 'Yes' : 'No'}`);
    
    // Graph analysis
    console.log('\n🕸️  Graph (Card Relationships):');
    const components = game.getConnectedComponents();
    console.log(`   - Connected components: ${components.length}`);
    console.log(`   - Largest component size: ${Math.max(...components.map(c => c.length))}`);
    
    // Hash table analysis
    console.log('\n🗂️  Hash Table (Card Lookup):');
    console.log(`   - Total cards stored: ${game.cards.length}`);
    console.log(`   - Hash table size: ${game.cardHash.keyMap.length}`);
    
    // Sorting analysis
    console.log('\n📊 Sorting Analysis:');
    const sortedBySymbol = game.sortCardsBySymbol();
    const sortedByPosition = game.sortCardsByPosition();
    console.log(`   - Cards sorted by symbol: ${sortedBySymbol.length} items`);
    console.log(`   - Cards sorted by position: ${sortedByPosition.length} items`);
    
    // Algorithm complexity
    console.log('\n⚡ Algorithm Complexity:');
    console.log('   - Card lookup: O(1) average (Hash Table)');
    console.log('   - Move history: O(1) push/pop (Stack)');
    console.log('   - BFS pathfinding: O(V + E)');
    console.log('   - DFS components: O(V + E)');
    console.log('   - Sorting: O(n log n)');
    
    console.log('\n✅ Game Engine Test Completed Successfully!');
}

// Test data structures individually
function testDataStructures() {
    console.log('\n🧪 Testing Individual Data Structures...\n');
    
    // Test Stack
    console.log('📚 Testing Stack:');
    const { Stack } = require('./core/GameEngine');
    const stack = new Stack();
    
    stack.push('Move 1');
    stack.push('Move 2');
    stack.push('Move 3');
    
    console.log(`   - Stack size: ${stack.size()}`);
    console.log(`   - Top element: ${stack.peek()}`);
    console.log(`   - Popped: ${stack.pop()}`);
    console.log(`   - New size: ${stack.size()}`);
    
    // Test Queue
    console.log('\n📋 Testing Queue:');
    const { Queue } = require('./core/GameEngine');
    const queue = new Queue();
    
    queue.enqueue('Task 1');
    queue.enqueue('Task 2');
    queue.enqueue('Task 3');
    
    console.log(`   - Queue size: ${queue.size()}`);
    console.log(`   - Front element: ${queue.front()}`);
    console.log(`   - Dequeued: ${queue.dequeue()}`);
    console.log(`   - New size: ${queue.size()}`);
    
    // Test Binary Search Tree
    console.log('\n🌳 Testing Binary Search Tree:');
    const { BinarySearchTree } = require('./core/GameEngine');
    const bst = new BinarySearchTree();
    
    bst.insert('Player A', 100);
    bst.insert('Player B', 150);
    bst.insert('Player C', 75);
    bst.insert('Player D', 200);
    
    const scores = bst.getTopScores();
    console.log('   - Top scores:');
    scores.forEach((score, index) => {
        console.log(`     ${index + 1}. ${score.value}: ${score.score} points`);
    });
    
    // Test Hash Table
    console.log('\n🗂️  Testing Hash Table:');
    const { HashTable } = require('./core/GameEngine');
    const hashTable = new HashTable();
    
    hashTable.set('key1', 'value1');
    hashTable.set('key2', 'value2');
    hashTable.set('key3', 'value3');
    
    console.log(`   - Value for key1: ${hashTable.get('key1')}`);
    console.log(`   - Value for key2: ${hashTable.get('key2')}`);
    console.log(`   - Value for key4: ${hashTable.get('key4') || 'Not found'}`);
    
    console.log('\n✅ Data Structures Test Completed Successfully!');
}

// Run tests
try {
    testDataStructures();
    testGameEngine();
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📖 To run the full game with GUI/CLI:');
    console.log('   1. Install dependencies: npm install');
    console.log('   2. Run CLI mode: npm run cli');
    console.log('   3. Run GUI mode: npm run gui');
    console.log('   4. Or use main launcher: npm start');
    
} catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
} 