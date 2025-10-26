const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");
const messageDiv = document.getElementById("message");
const newGameBtn = document.getElementById("newGameBtn");

const PADDLE_WIDTH = 10, PADDLE_HEIGHT = 80;
const BALL_SIZE = 12;
const PLAYER_X = 20, AI_X = canvas.width - 20 - PADDLE_WIDTH;
const PADDLE_SPEED = 6;
const BALL_SPEED = 5;
const WIN_SCORE = 5;

let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballVX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVY = BALL_SPEED * (Math.random() * 2 - 1);

let playerScore = 0, aiScore = 0;
let isGameActive = true;

// Mouse control for player paddle
canvas.addEventListener("mousemove", (e) => {
    if (!isGameActive) return;
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;
});

newGameBtn.addEventListener("click", () => {
    playerScore = 0;
    aiScore = 0;
    document.getElementById("playerScore").textContent = playerScore;
    document.getElementById("aiScore").textContent = aiScore;
    messageDiv.textContent = "";
    newGameBtn.style.display = "none";
    isGameActive = true;
    resetBall(Math.random() > 0.5 ? 1 : -1);
});

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
}

function resetBall(direction) {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballVX = BALL_SPEED * direction;
    ballVY = BALL_SPEED * (Math.random() * 2 - 1);
}

function updateAI() {
    let centerAI = aiY + PADDLE_HEIGHT / 2;
    if (centerAI < ballY + BALL_SIZE / 2 - 10) aiY += PADDLE_SPEED;
    else if (centerAI > ballY + BALL_SIZE / 2 + 10) aiY -= PADDLE_SPEED;
    if (aiY < 0) aiY = 0;
    if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;
}

function updateBall() {
    ballX += ballVX;
    ballY += ballVY;

    if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
        ballVY *= -1;
        ballY = ballY <= 0 ? 0 : canvas.height - BALL_SIZE;
    }

    // Player paddle
    if (
        ballX <= PLAYER_X + PADDLE_WIDTH &&
        ballY + BALL_SIZE > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballVX = Math.abs(ballVX);
        let hitPos = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
        ballVY = hitPos * 0.25;
        ballX = PLAYER_X + PADDLE_WIDTH;
    }
    // AI paddle
    if (
        ballX + BALL_SIZE >= AI_X &&
        ballY + BALL_SIZE > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballVX = -Math.abs(ballVX);
        let hitPos = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
        ballVY = hitPos * 0.25;
        ballX = AI_X - BALL_SIZE;
    }

    // Score Logic
    if (ballX < 0) {
        aiScore++;
        document.getElementById("aiScore").textContent = aiScore;
        checkGameOver();
        if (isGameActive) resetBall(1);
    } else if (ballX + BALL_SIZE > canvas.width) {
        playerScore++;
        document.getElementById("playerScore").textContent = playerScore;
        checkGameOver();
        if (isGameActive) resetBall(-1);
    }
}

function checkGameOver() {
    if (playerScore + aiScore >= WIN_SCORE) {
        isGameActive = false;
        if (playerScore > aiScore) {
            messageDiv.textContent = "Player Wins!";
        } else if (aiScore > playerScore) {
            messageDiv.textContent = "AI Wins!";
        } else {
            messageDiv.textContent = "It's a Tie!";
        }
        newGameBtn.style.display = "inline-block";
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, "#fff");
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, "#fff");
    drawBall(ballX, ballY, BALL_SIZE, "#fff");

    ctx.strokeStyle = "#fff";
    ctx.setLineDash([8, 12]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function gameLoop() {
    if (isGameActive) {
        updateAI();
        updateBall();
    }
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();