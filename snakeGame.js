// Common Variables
const box = 20;
let snake, direction, food, score, game;
const obstacles = [
    { x: 5 * box, y: 5 * box },
    { x: 10 * box, y: 15 * box },
    { x: 15 * box, y: 10 * box },
];


// Initialize Game
function initGame(mode) {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = null;
    food = { x: Math.floor(Math.random() * 19) * box, y: Math.floor(Math.random() * 19) * box };
    score = 0;
    if (mode === "simple") {
        document.getElementById("simpleScore").innerText = score;
    } else if (mode === "obstacles") {
        document.getElementById("obstacleScore").innerText = score;
    }
}

// Start Game for Specific Mode
function startGame(mode) {
    clearInterval(game);
    initGame(mode);
    game = setInterval(() => draw(mode), 200);
}

// Set Direction on Arrow Key Press
document.addEventListener('keydown', setDirection);
function setDirection(event) {
    if (event.keyCode === 37 && direction !== "RIGHT") direction = "LEFT";
    else if (event.keyCode === 38 && direction !== "DOWN") direction = "UP";
    else if (event.keyCode === 39 && direction !== "LEFT") direction = "RIGHT";
    else if (event.keyCode === 40 && direction !== "UP") direction = "DOWN";
}

// Draw Function for Simple Mode and Obstacles Mode
function draw(mode) {
    const canvas = document.getElementById(mode === "simple" ? 'simpleCanvas' : 'obstaclesCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Border
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.fillRect(2, 2, canvas.width - 4, canvas.height - 4);

    // Draw Snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box - 2, box - 2);
        ctx.strokeRect(snake[i].x, snake[i].y, box - 2, box - 2);
    }

    // Draw Food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box - 2, box - 2);

    // Draw Obstacles if in Obstacles Mode
    if (mode === "obstacles") {
        ctx.fillStyle = "blue";
        obstacles.forEach(obstacle => {
            ctx.fillRect(obstacle.x, obstacle.y, box - 2, box - 2);
        });
    }

    let headX = snake[0].x;
    let headY = snake[0].y;

    // Update Head Position Based on Direction
    if (direction === "LEFT") headX -= box;
    if (direction === "UP") headY -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "DOWN") headY += box;

    // Check for Collision with Food
    if (headX === food.x && headY === food.y) {
        food = { x: Math.floor(Math.random() * 19) * box, y: Math.floor(Math.random() * 19) * box };
        score++;
        document.getElementById(mode === "simple" ? "simpleScore" : "obstacleScore").innerText = score;
    } else {
        snake.pop();
    }

    let newHead = { x: headX, y: headY };

    // Check for Game Over Conditions
    if (headX < 0 || headX >= canvas.width || headY < 0 || headY >= canvas.height ||
        collision(newHead, snake) || (mode === "obstacles" && collision(newHead, obstacles))) {
        clearInterval(game);
        alert("Game Over! Your score: " + score);
    }

    snake.unshift(newHead);
}

// Collision Check Function
function collision(head, array) {
    return array.some(element => head.x === element.x && head.y === element.y);
}
