document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const gameOverMessage = document.getElementById('game-over-message');
    const restartButton = document.getElementById('restart-button');
    const gridSize = 4;
    let board = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
    let score = 0;
    let isGameOver = false;

    // Initialize the game board with empty grid cells
    function createBackgroundGrid() {
        gameBoard.innerHTML = '';
        for (let i = 0; i < gridSize * gridSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            gameBoard.appendChild(cell);
        }
    }

    // Add a new tile (2 or 4) to a random empty cell
    function addRandomTile() {
        const emptyCells = [];
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (board[r][c] === 0) {
                    emptyCells.push({ r, c });
                }
            }
        }

        if (emptyCells.length > 0) {
            const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            board[r][c] = Math.random() < 0.9 ? 2 : 4;
            createTileElement(r, c, board[r][c]);
        }
    }

    // Create a tile element at specified position
    function createTileElement(r, c, value) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.dataset.value = value;
        tile.textContent = value;
        tile.style.top = `${r * (67.5 + 10) + 10}px`;
        tile.style.left = `${c * (67.5 + 10) + 10}px`;
        gameBoard.appendChild(tile);
    }

    // Update score display
    function updateScoreDisplay() {
        scoreDisplay.textContent = score;
    }

    // Check if game is over (no moves left)
    function checkGameOver() {
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (board[r][c] === 0) return false;
                if (c < gridSize - 1 && board[r][c] === board[r][c + 1]) return false;
                if (r < gridSize - 1 && board[r][c] === board[r + 1][c]) return false;
            }
        }
        return true;
    }

    // Show game over message
    function showGameOver() {
        gameOverMessage.classList.remove('hidden');
        isGameOver = true;
    }

    // Reset the game state
    function resetGame() {
        board = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
        score = 0;
        isGameOver = false;
        gameBoard.querySelectorAll('.tile').forEach(tile => tile.remove());
        gameOverMessage.classList.add('hidden');
        updateScoreDisplay();
        addRandomTile();
        addRandomTile();
    }

    // Handle keyboard input
    function handleInput(e) {
        if (isGameOver) return;

        let moved = false;
        const oldBoard = JSON.parse(JSON.stringify(board));

        switch (e.key) {
            case 'ArrowUp': moved = moveUp(); break;
            case 'ArrowDown': moved = moveDown(); break;
            case 'ArrowLeft': moved = moveLeft(); break;
            case 'ArrowRight': moved = moveRight(); break;
            default: return;
        }

        if (moved) {
            addRandomTile();
            if (checkGameOver()) showGameOver();
        }
    }

    // Movement functions
    function moveUp() {
        let moved = false;
        for (let c = 0; c < gridSize; c++) {
            for (let r = 1; r < gridSize; r++) {
                if (board[r][c] !== 0) {
                    let newR = r;
                    while (newR > 0 && board[newR - 1][c] === 0) {
                        board[newR - 1][c] = board[newR][c];
                        board[newR][c] = 0;
                        newR--;
                        moved = true;
                    }
                    if (newR > 0 && board[newR - 1][c] === board[newR][c]) {
                        board[newR - 1][c] *= 2;
                        score += board[newR - 1][c];
                        board[newR][c] = 0;
                        moved = true;
                    }
                }
            }
        }
        if (moved) updateTiles();
        return moved;
    }

    function moveDown() {
        let moved = false;
        for (let c = 0; c < gridSize; c++) {
            for (let r = gridSize - 2; r >= 0; r--) {
                if (board[r][c] !== 0) {
                    let newR = r;
                    while (newR < gridSize - 1 && board[newR + 1][c] === 0) {
                        board[newR + 1][c] = board[newR][c];
                        board[newR][c] = 0;
                        newR++;
                        moved = true;
                    }
                    if (newR < gridSize - 1 && board[newR + 1][c] === board[newR][c]) {
                        board[newR + 1][c] *= 2;
                        score += board[newR + 1][c];
                        board[newR][c] = 0;
                        moved = true;
                    }
                }
            }
        }
        if (moved) updateTiles();
        return moved;
    }

    function moveLeft() {
        let moved = false;
        for (let r = 0; r < gridSize; r++) {
            for (let c = 1; c < gridSize; c++) {
                if (board[r][c] !== 0) {
                    let newC = c;
                    while (newC > 0 && board[r][newC - 1] === 0) {
                        board[r][newC - 1] = board[r][newC];
                        board[r][newC] = 0;
                        newC--;
                        moved = true;
                    }
                    if (newC > 0 && board[r][newC - 1] === board[r][newC]) {
                        board[r][newC - 1] *= 2;
                        score += board[r][newC - 1];
                        board[r][newC] = 0;
                        moved = true;
                    }
                }
            }
        }
        if (moved) updateTiles();
        return moved;
    }

    function moveRight() {
        let moved = false;
        for (let r = 0; r < gridSize; r++) {
            for (let c = gridSize - 2; c >= 0; c--) {
                if (board[r][c] !== 0) {
                    let newC = c;
                    while (newC < gridSize - 1 && board[r][newC + 1] === 0) {
                        board[r][newC + 1] = board[r][newC];
                        board[r][newC] = 0;
                        newC++;
                        moved = true;
                    }
                    if (newC < gridSize - 1 && board[r][newC + 1] === board[r][newC]) {
                        board[r][newC + 1] *= 2;
                        score += board[r][newC + 1];
                        board[r][newC] = 0;
                        moved = true;
                    }
                }
            }
        }
        if (moved) updateTiles();
        return moved;
    }

    // Update all tile positions after movement
    function updateTiles() {
        gameBoard.querySelectorAll('.tile').forEach(tile => tile.remove());
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (board[r][c] !== 0) {
                    createTileElement(r, c, board[r][c]);
                }
            }
        }
        updateScoreDisplay();
    }

    // Event listeners
    document.addEventListener('keydown', handleInput);
    restartButton.addEventListener('click', resetGame);

    // Start the game
    createBackgroundGrid();
    resetGame();
});
