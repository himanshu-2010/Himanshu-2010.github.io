// Difficulty-based minimum cell sizes
const difficultyCellSize = {
    Easy: 25,
    Medium: 20,
    Hard: 15
};

let direction = "";
let cells = {};  // Object for cells
let currentDifficulty = "Easy";
let difficultyTime = 300;
let gameInterval;
let rows, cols; // Track grid dimensions for boundary checking
let isPaused = false;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let food = null;
let gameTimer = 0;
let timerInterval;

const snake = [{ x: 1, y: 5 }, { x: 1, y: 6 }, { x: 1, y: 7 }]; // Initial snake position

// Event listener setup
document.addEventListener("keydown", (event) => {
    if (event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        togglePause();
        return;
    }
    
    if (event.key === "r" || event.key === "R") {
        resetGame();
        return;
    }
    
    if (isPaused) return; // Don't process movement keys if paused
    
    if (event.key === "ArrowLeft" || event.key === "a") {
        if (direction !== "right") direction = "left"; // Prevent 180-degree turns
    }
    else if (event.key === "ArrowRight" || event.key === "d") {
        if (direction !== "left") direction = "right";
    }
    else if (event.key === "ArrowUp" || event.key === "w") {
        if (direction !== "down") direction = "up";
    }
    else if (event.key === "ArrowDown" || event.key === "s") {
        if (direction !== "up") direction = "down";
    }
});

// Initialize high score display
document.getElementById("H-score").textContent = highScore;

function createSnakeBoard() {
    const board = document.getElementById("board");
    const boardContainer = document.getElementById("board-container");
    const containerRect = boardContainer.getBoundingClientRect();

    const availableWidth = Math.floor(containerRect.width);
    const availableHeight = Math.floor(containerRect.height);

    const minCellSize = difficultyCellSize[currentDifficulty];

    rows = Math.floor(availableHeight / minCellSize);
    cols = Math.floor(availableWidth / minCellSize);

    let cellSizeH = availableHeight / rows;
    let cellSizeW = availableWidth / cols;
    let cellSize = Math.floor(Math.min(cellSizeH, cellSizeW));

    // Ensure minimum grid size
    if (rows < 5) rows = 5;
    if (cols < 5) cols = 5;

    board.style.display = "grid";
    board.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
    board.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;

    board.innerHTML = "";
    cells = {}; // Reset cells object

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            board.appendChild(cell);
            cells[`${i}-${j}`] = cell;
        }
    }
    
    // Initialize game elements
    renderSnake();
    generateFood();
    updateScoreDisplay();
    updateTimerDisplay();
}

function renderSnake() {
    snake.forEach(segment => {
        const cellKey = `${segment.x}-${segment.y}`;
        if (cells[cellKey]) {
            cells[cellKey].classList.add("snake");
        }
    });
}
function unRenderSnake() {
    // Remove snake class from all cells
    for (const key in cells) {
        if (cells[key].classList.contains("snake")) {
            cells[key].classList.remove("snake");
        }
    }
    
    // Alternative approach using Object.values():
    // Object.values(cells).forEach(cell => {
    //     if (cell.classList.contains("snake")) {
    //         cell.classList.remove("snake");
    //     }
    // });
}

function renderFood() {
    if (food) {
        const cellKey = `${food.x}-${food.y}`;
        if (cells[cellKey]) {
            cells[cellKey].classList.remove("food");
        }
    }
    
    if (food && cells[`${food.x}-${food.y}`]) {
        cells[`${food.x}-${food.y}`].classList.add("food");
    }
}

function generateFood() {
    // Remove old food
    if (food) {
        const oldFoodKey = `${food.x}-${food.y}`;
        if (cells[oldFoodKey]) {
            cells[oldFoodKey].classList.remove("food");
        }
    }
    
    // Generate new food position that doesn't overlap with snake
    let newFoodPosition;
    let attempts = 0;
    const maxAttempts = rows * cols * 2; // Prevent infinite loop
    
    do {
        newFoodPosition = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols)
        };
        attempts++;
        
        // Check if position is occupied by snake
        let positionOccupied = false;
        for (let segment of snake) {
            if (segment.x === newFoodPosition.x && segment.y === newFoodPosition.y) {
                positionOccupied = true;
                break;
            }
        }
        
        if (!positionOccupied || attempts >= maxAttempts) {
            break;
        }
    } while (true);
    
    food = newFoodPosition;
    renderFood();
}

function updateScoreDisplay() {
    const scoreElement = document.getElementById("C-score");
    const highScoreElement = document.getElementById("H-score");
    
    if (scoreElement) {
        scoreElement.textContent = score;
    }
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        if (highScoreElement) {
            highScoreElement.textContent = highScore;
        }
    }
}

function updateTimerDisplay() {
    const timerElement = document.getElementById("Timer");
    if (timerElement) {
        const minutes = Math.floor(gameTimer / 60).toString().padStart(2, '0');
        const seconds = (gameTimer % 60).toString().padStart(2, '0');
        timerElement.textContent = `${minutes}:${seconds}`;
    }
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    gameTimer = 0;
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        if (!isPaused) {
            gameTimer++;
            updateTimerDisplay();
        }
    }, 1000);
}

function togglePause() {
    isPaused = !isPaused;
    
    if (isPaused) {
        console.log("Game paused");
        if (gameInterval) {
            clearInterval(gameInterval);
            gameInterval = null;
        }
        // Update timer display to show paused state
        const timerElement = document.getElementById("Timer");
        if (timerElement) {
            timerElement.style.color = "var(--food-color)";
        }
    } else {
        console.log("Game resumed");
        const timerElement = document.getElementById("Timer");
        if (timerElement) {
            timerElement.style.color = "var(--text-color)";
        }
        startGame();
    }
}

function gameLoop() {
    if (!direction || isPaused) return; // Don't move if no direction set or paused
    
    let head;
    if (direction === "left") {
        head = { x: snake[0].x, y: snake[0].y - 1 };
    }
    else if (direction === "right") {
        head = { x: snake[0].x, y: snake[0].y + 1 };
    }
    else if (direction === "up") {
        head = { x: snake[0].x - 1, y: snake[0].y };
    }
    else if (direction === "down") {
        head = { x: snake[0].x + 1, y: snake[0].y };
    } else {
        return; // Invalid direction
    }
    
    // Boundary checking - wrap around instead of game over
    if (head.x < 0) head.x = rows - 1;
    else if (head.x >= rows) head.x = 0;
    if (head.y < 0) head.y = cols - 1;
    else if (head.y >= cols) head.y = 0;
    
    // Self-collision checking
    for (let segment of snake) {
        if (segment.x === head.x && segment.y === head.y) {
            console.log("Game Over! Snake collided with itself.");
            alert(`Game Over! Snake collided with itself.\nFinal Score: ${score}\nTime: ${Math.floor(gameTimer/60).toString().padStart(2, '0')}:${(gameTimer%60).toString().padStart(2, '0')}`);
            resetGame();
            return;
        }
    }
    
    // Check if snake eats food
    let ateFood = false;
    if (food && head.x === food.x && head.y === food.y) {
        ateFood = true;
        score += 10 * (currentDifficulty === "Hard" ? 3 : currentDifficulty === "Medium" ? 2 : 1);
        generateFood();
        updateScoreDisplay();
    }
    
    snake.unshift(head);
    unRenderSnake();
    
    if (!ateFood) {
        snake.pop();
    }
    
    renderSnake();
    renderFood();
}

function resetGame() {
    console.log("Resetting game...");
    
    // Reset snake to initial position
    snake.length = 0; // Clear the array
    snake.push({ x: 1, y: 5 }, { x: 1, y: 6 }, { x: 1, y: 7 });
    
    // Reset game state
    direction = "";
    score = 0;
    isPaused = false;
    
    // Clear any existing intervals
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Re-render everything
    unRenderSnake();
    generateFood();
    renderSnake();
    updateScoreDisplay();
    updateTimerDisplay();
    
    // Reset timer color
    const timerElement = document.getElementById("Timer");
    if (timerElement) {
        timerElement.style.color = "var(--text-color)";
    }
    
    // Restart the game
    startGame();
    startTimer();
    
    console.log("Game reset. Ready to play again!");
}

function startGame() {
    if (gameInterval) clearInterval(gameInterval);
    
    // Set difficulty time based on current difficulty
    if (currentDifficulty === "Easy") {
        difficultyTime = 300;
    }
    else if (currentDifficulty === "Medium") {
        difficultyTime = 200;
    } else if (currentDifficulty === "Hard") {
        difficultyTime = 100;
    }
    
    gameInterval = setInterval(gameLoop, difficultyTime);
    console.log(`Game started with ${currentDifficulty} difficulty (interval: ${difficultyTime}ms)`);
}

// Update difficulty and rebuild board
document.getElementById("difficulty-select").addEventListener("change", (e) => {
    currentDifficulty = e.target.value;
    console.log(`Difficulty changed to: ${currentDifficulty}`);
    createSnakeBoard();
    resetGame(); // Reset game with new difficulty
});
// Create instructions popup on first visit
function showInstructions() {
    if (!localStorage.getItem('snakeInstructionsShown')) {
        const instructions = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--translucent-90);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 30px;
            border-radius: 20px;
            border: 2px solid var(--border-glow);
            color: var(--text-color);
            z-index: 1000;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 60px var(--board-shadow);
        ">
            <h2 style="color: var(--snake-color); margin-bottom: 20px; text-align: center;">🐍 Welcome to Snake Game!</h2>
            <div style="margin-bottom: 25px;">
                <h3 style="color: var(--food-color); margin-bottom: 10px;">🎮 Controls:</h3>
                <ul style="padding-left: 20px; line-height: 1.6;">
                    <li><strong>Arrow Keys or WASD:</strong> Move the snake</li>
                    <li><strong>Space Bar:</strong> Pause/Resume game</li>
                    <li><strong>R Key:</strong> Reset game</li>
                </ul>
            </div>
            <div style="margin-bottom: 25px;">
                <h3 style="color: var(--food-color); margin-bottom: 10px;">🎯 Game Rules:</h3>
                <ul style="padding-left: 20px; line-height: 1.6;">
                    <li>Eat the red food to grow and earn points</li>
                    <li>Don't hit yourself!</li>
                    <li>Walls will wrap around to the other side</li>
                    <li>Higher difficulties = faster snake + more points!</li>
                </ul>
            </div>
            <div style="display: flex; justify-content: center; margin-top: 20px;">
                <button id="start-playing-btn" 
                style="
                    background: var(--snake-color);
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 10px;
                    font-size: 1.1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: bold;
                "
                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px var(--snake-color)';"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';"
                >
                    Start Playing!
                </button>
            </div>
        </div>
        `;
        
        const overlay = document.createElement('div');
        overlay.id = 'instructions-overlay';
        overlay.innerHTML = instructions;
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 999;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        document.body.appendChild(overlay);
        
        // Add event listener to the button
        setTimeout(() => {
            const startBtn = document.getElementById('start-playing-btn');
            if (startBtn) {
                startBtn.addEventListener('click', () => {
                    localStorage.setItem('snakeInstructionsShown', 'true');
                    const overlay = document.getElementById('instructions-overlay');
                    if (overlay) {
                        overlay.remove();
                    }
                });
            }
        }, 100);
    }
}

// Initialize the game
window.addEventListener('load', () => {
    createSnakeBoard();
    resetGame();
    showInstructions();
});

// Recreate board on window resize (with debouncing for performance)
let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        console.log("Window resized, recreating board...");
        createSnakeBoard();
        renderSnake();
        renderFood();
    }, 250); // 250ms debounce
});

// Add keyboard shortcuts info to console
console.log("%c🐍 Snake Game Controls:", "color: #4CAF50; font-size: 14px; font-weight: bold;");
console.log("%cArrow Keys/WASD: Move snake", "color: #e6e6e6;");
console.log("%cSpace: Pause/Resume", "color: #e6e6e6;");
console.log("%cR: Reset game", "color: #e6e6e6;");
console.log("%cHave fun playing!", "color: #FF5722; font-size: 16px; font-weight: bold;");

// Add this to the end of your script.js file

// Mobile Controls
if (document.getElementById('mobile-controls')) {
    // D-Pad Controls
    const dpadButtons = document.querySelectorAll('.dpad-btn');
    
    dpadButtons.forEach(btn => {
        // Touch events for mobile
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const dir = btn.getAttribute('data-direction');
            handleDirectionChange(dir);
        });
        
        // Click events for testing on desktop
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const dir = btn.getAttribute('data-direction');
            handleDirectionChange(dir);
        });
    });
    
    // Helper function to handle direction changes
    function handleDirectionChange(dir) {
        if (isPaused) return;
        
        if (dir === 'left' && direction !== 'right') {
            direction = 'left';
        } else if (dir === 'right' && direction !== 'left') {
            direction = 'right';
        } else if (dir === 'up' && direction !== 'down') {
            direction = 'up';
        } else if (dir === 'down' && direction !== 'up') {
            direction = 'down';
        }
    }
    
    // Mobile Pause Button
    const mobilePauseBtn = document.getElementById('mobile-pause');
    if (mobilePauseBtn) {
        mobilePauseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            togglePause();
            updatePauseButtonText();
        });
        
        mobilePauseBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            togglePause();
            updatePauseButtonText();
        });
    }
    
    // Mobile Reset Button
    const mobileResetBtn = document.getElementById('mobile-reset');
    if (mobileResetBtn) {
        mobileResetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resetGame();
        });
        
        mobileResetBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            resetGame();
        });
    }
    
    // Update pause button text based on game state
    function updatePauseButtonText() {
        const pauseBtn = document.getElementById('mobile-pause');
        if (pauseBtn) {
            const span = pauseBtn.querySelector('span');
            const svg = pauseBtn.querySelector('svg path');
            
            if (isPaused) {
                span.textContent = 'Resume';
                // Play icon
                svg.setAttribute('d', 'M8 5v14l11-7z');
            } else {
                span.textContent = 'Pause';
                // Pause icon
                svg.setAttribute('d', 'M10 4H6v16h4V4zm8 0h-4v16h4V4z');
            }
        }
    }
}

// Prevent page scrolling on mobile when using controls
document.addEventListener('touchmove', function(e) {
    if (e.target.closest('#mobile-controls')) {
        e.preventDefault();
    }
}, { passive: false });

// Add haptic feedback for mobile devices (if supported)
function vibrateDevice(duration = 10) {
    if ('vibrate' in navigator) {
        navigator.vibrate(duration);
    }
}

// Add haptic feedback to all mobile controls
document.querySelectorAll('.dpad-btn, .control-btn').forEach(btn => {
    btn.addEventListener('touchstart', () => {
        vibrateDevice(10);
    });
});
