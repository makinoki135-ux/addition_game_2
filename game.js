// game.js

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
const restartBtn = document.getElementById("restart-btn");
const arrowButtons = document.querySelectorAll(".arrow-btn");

function randomDigit() {
  return Math.floor(Math.random() * 9) + 1; // 1〜9
}

function setNewNumbers() {
  leftNumber = randomDigit();
  rightNumber = randomDigit();
  leftNumberEl.textContent = leftNumber;
  rightNumberEl.textContent = rightNumber;
}

function getCorrectDirection() {
  const sum = leftNumber + rightNumber;

  // 1. 合計して10 → 上矢印
  if (sum === 10) {
    return "up";
  }

  // 2. 左右が同じ → 下矢印（ただし5と5は上で処理済み）
  if (leftNumber === rightNumber) {
    return "down";
  }

  // 3. 左右が異なる → 大きい数字の方向
  if (leftNumber > rightNumber) {
    return "left";
  } else {
    return "right";
  }
}

function updateScore() {
  scoreEl.textContent = score;
}

function updateTime() {
  timeEl.textContent = timeLeft;
}

function setButtonsEnabled(enabled) {
  arrowButtons.forEach((btn) => {
    btn.disabled = !enabled;
  });
}

function startTimer() {
  if (timerId) {
    clearInterval(timerId);
  }

  timerId = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      timeLeft = 0;
      updateTime();
      endGame();
      return;
    }
    updateTime();
  }, 1000);
}

function endGame() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  isGameOver = true;
  setButtonsEnabled(false);
  messageEl.textContent = `終了！最終ポイントは ${score} です。`;
}

function handleArrowInput(direction) {
  if (isGameOver || timeLeft <= 0) {
    return;
  }

  const correctDirection = getCorrectDirection();

  if (direction === correctDirection) {
    score++;
    messageEl.textContent = "正解！";
  } else {
    score--;
    messageEl.textContent = "まちがい…";
  }

  updateScore();
  setNewNumbers();
}

function attachButtonHandlers() {
  arrowButtons.forEach((btn) => {
    const direction = btn.dataset.direction;

    // pointerup でタブレットのタップにも反応
    btn.addEventListener("pointerup", () => {
      handleArrowInput(direction);
    });
  });
}

function restartGame() {
  score = 0;
  timeLeft = 60;
  isGameOver = false;
  updateScore();
  updateTime();
  messageEl.textContent = "";
  setButtonsEnabled(true);
  setNewNumbers();
  startTimer();
}

function initGame() {
  attachButtonHandlers();
  restartBtn.addEventListener("pointerup", restartGame);
  restartGame(); // ページ読み込み時に自動スタート
}

document.addEventListener("DOMContentLoaded", initGame);
