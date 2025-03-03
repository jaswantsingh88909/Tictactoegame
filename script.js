const cells = document.querySelectorAll('.cell');
const statusDiv = document.getElementById('status');
const restartButton = document.getElementById('restart-button');
const gameModeSelect = document.getElementById('game-mode');

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let gameMode = 'human-vs-human'; // Default game mode is Human vs Human

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Function to handle a player's move
const handleCellClick = (event) => {
    const cell = event.target;
    const index = cell.getAttribute('data-cell-index');
    
    if (board[index] !== '' || !gameActive) {
        return;
    }

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add('taken');

    if (checkWinner()) {
        gameActive = false;
        statusDiv.textContent = `${currentPlayer} Wins!`;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    if (gameMode === 'human-vs-system' && currentPlayer === 'O') {
        setTimeout(systemMove, 500); // Delay system move
    } else {
        statusDiv.textContent = `Player ${currentPlayer}'s Turn`;
    }
};

// Function to check if there's a winner
const checkWinner = () => {
    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return board[a] === board[b] && board[b] === board[c] && board[a] !== '';
    });
};

// Minimax algorithm to calculate the best move for the AI (System)
const minimax = (board, depth, isMaximizingPlayer) => {
    const scores = {
        'X': -10,
        'O': 10,
        'tie': 0
    };

    // Check for a winner or tie
    const winner = getWinner(board);
    if (winner !== null) {
        return scores[winner];
    }

    // If board is full (tie)
    if (board.every(cell => cell !== '')) {
        return scores.tie;
    }

    // Maximizing for AI (O), minimizing for Human (X)
    let bestScore = isMaximizingPlayer ? -Infinity : Infinity;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = isMaximizingPlayer ? 'O' : 'X'; // Make a move
            let score = minimax(board, depth + 1, !isMaximizingPlayer);
            board[i] = ''; // Undo the move

            bestScore = isMaximizingPlayer
                ? Math.max(score, bestScore)
                : Math.min(score, bestScore);
        }
    }
    return bestScore;
};

// Function to get the best move for the AI (System)
const getBestMove = () => {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';  // System plays 'O'
            let score = minimax(board, 0, false);
            board[i] = ''; // Undo the move

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
};

// Function for the system (AI) to make its move
const systemMove = () => {
    const bestMove = getBestMove();

    board[bestMove] = 'O';
    cells[bestMove].textContent = 'O';
    cells[bestMove].classList.add('taken');

    if (checkWinner()) {
        gameActive = false;
        statusDiv.textContent = `O Wins!`;
        return;
    }

    currentPlayer = 'X';
    statusDiv.textContent = `Player X's Turn`;
};

// Function to restart the game
const restartGame = () => {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    statusDiv.textContent = `Player X's Turn`;

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken');
    });
};

// Event listener for clicking on cells
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

// Event listener for the restart button
restartButton.addEventListener('click', restartGame);

// Event listener for selecting the game mode
gameModeSelect.addEventListener('change', (event) => {
    gameMode = event.target.value;
    restartGame(); // Restart game when mode is changed
});

statusDiv.textContent = `Player X's Turn`;

// Helper function to get the winner of the board
function getWinner(board) {
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Return 'X' or 'O'
        }
    }
    return null;
}
