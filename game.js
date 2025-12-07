let leftNumber = 0;
let rightNumber = 0;
let score = 0;
let timeLeft = 60;
let timerId = null;
let isGameOver = false;

const leftNumberEl = document.getElementById("left-number");
const rightNumberEl = document.getElementById("right-number");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const messageEl = document.getElementById("message");

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const arrowButtons = document.querySelectorAll(".arrow-btn");

function randomDigit() {
  return Math.floor(Math.random() * 9) + 1;
}

function setNewNumbers() {
  leftNumber = randomDigit();
  rightNumber = randomDigit();
  leftNumberEl.textContent = leftNumber;
  rightNumberEl.textContent = rightNumber;
}

function getCorrectDirection() {
  const sum = leftNumber + rightNumber;

  if (sum === 10) return "up";
  if (leftNumber === rightNumber) return "down";
  return leftNumber > rightNumber ? "left" : "right";
}

function updateScore() {
  scoreEl.textContent = score;
}

function updateTime() {
  timeEl.textContent = timeLeft;
}

function setButtonsEnabled(enabled) {
  arrowButtons.forEach((btn) => (btn.disabled = !enabled));
}

function startTimer() {
  timerId = setInterval(() => {
    timeLeft--;
    updateTime();

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(timerId);
  isGameOver = true;
  setButtonsEnabled(false);

  messageEl.textContent = `終了！ 最終ポイントは ${score} です。`;

  restartBtn.style.display = "block";
  startBtn.style.display = "none";
}

function handleArrowInput(direction) {
  if (isGameOver) return;

  const correct = getCorrectDirection();

  if (direction === correct) {
    score++;
    messageEl.textContent = "正解！";
  } else {
    score--;
    messageEl.textContent = "まちがい…";
  }

  updateScore();
  setNewNumbers();
}

function attachHandlers() {
  arrowButtons.forEach((btn) => {
    btn.addEventListener("pointerup", () => {
      handleArrowInput(btn.dataset.direction);
    });
  });

  startBtn.addEventListener("pointerup", startGame);
  restartBtn.addEventListener("pointerup", restartGame);
}

function startGame() {
  startBtn.style.display = "none";
  restartBtn.style.display = "none";

  score = 0;
  timeLeft = 60;
  isGameOver = false;
  messageEl.textContent = "";

  updateScore();
  updateTime();

  setButtonsEnabled(true);
  setNewNumbers();
  startTimer();
}

function restartGame() {
  startGame();
}

function initGame() {
  attachHandlers();
}

document.addEventListener("DOMContentLoaded", initGame);
