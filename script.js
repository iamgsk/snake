const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scale = 20; // Size of each grid cell
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let food;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

const reloadButton = document.getElementById("reloadButton");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");

highScoreElement.textContent = highScore;

// Sound Effects
const eatSound = new Audio('https://www.soundjay.com/button/beep-07.wav');
const gameOverSound = new Audio('https://www.soundjay.com/button/beep-10.wav');

// Restart the game
function restartGame() {
  score = 0;
  scoreElement.textContent = score;
  snake = new Snake();
  food = generateFood();
  reloadButton.classList.add("hidden");
  gameLoop();
}

// Snake constructor
function Snake() {
  this.body = [{ x: 5, y: 5 }];
  this.direction = "RIGHT";

  this.move = function () {
    const head = { ...this.body[0] };

    switch (this.direction) {
      case "LEFT": head.x -= 1; break;
      case "UP": head.y -= 1; break;
      case "RIGHT": head.x += 1; break;
      case "DOWN": head.y += 1; break;
    }

    this.body.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score++;
      scoreElement.textContent = score;
      eatSound.play();
      food = generateFood();
      if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        highScoreElement.textContent = highScore;
      }
    } else {
      this.body.pop();
    }
  };

  this.changeDirection = function (event) {
    if (event.key === "ArrowLeft" && this.direction !== "RIGHT") {
      this.direction = "LEFT";
    } else if (event.key === "ArrowUp" && this.direction !== "DOWN") {
      this.direction = "UP";
    } else if (event.key === "ArrowRight" && this.direction !== "LEFT") {
      this.direction = "RIGHT";
    } else if (event.key === "ArrowDown" && this.direction !== "UP") {
      this.direction = "DOWN";
    }
  };

  this.collidesWithWall = function () {
    const head = this.body[0];
    return head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows;
  };

  this.collidesWithSelf = function () {
    const head = this.body[0];
    for (let i = 1; i < this.body.length; i++) {
      if (head.x === this.body[i].x && head.y === this.body[i].y) {
        return true;
      }
    }
    return false;
  };

  this.draw = function () {
    ctx.fillStyle = "rgba(50, 205, 50, 0.8)"; // Slightly transparent snake
    this.body.forEach(segment => {
      ctx.fillRect(segment.x * scale, segment.y * scale, scale, scale);
    });
  };
}

function generateFood() {
  const x = Math.floor(Math.random() * columns);
  const y = Math.floor(Math.random() * rows);
  return { x, y };
}

function drawFood() {
  const foodGradient = ctx.createRadialGradient(food.x * scale + scale / 2, food.y * scale + scale / 2, 0, food.x * scale + scale / 2, food.y * scale + scale / 2, scale);
  foodGradient.addColorStop(0, "yellow");
  foodGradient.addColorStop(1, "red");

  ctx.fillStyle = foodGradient;
  ctx.fillRect(food.x * scale, food.y * scale, scale, scale);
}

// Game Loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snake.move();
  snake.draw();
  drawFood();

  if (snake.collidesWithWall() || snake.collidesWithSelf()) {
    gameOverSound.play();
    reloadButton.classList.remove("hidden");
    return;
  }

  setTimeout(gameLoop, 80); // Faster game loop for smooth animation
}

// Event Listener for key press
document.addEventListener("keydown", (event) => snake.changeDirection(event));

snake = new Snake();
food = generateFood();
gameLoop();
