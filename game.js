// game.js

let leftNumber = 0;
let rightNumber = 0;
let score = 0;
let timeLeft = 60;
let timerId = null;
let isGameOver = false;
let streakCount = 0; // 連続正解数

let leftNumberEl;
let rightNumberEl;
let scoreEl;
let timeEl;
let messageEl;
let startOverlay;
let startBtn;
let restartBtn;
let arrowButtons;

function randomDigit() {
  // 1〜9の乱数
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

  // 1. 合計して10 → 上
  if (sum === 10) {
    return "up";
  }

  // 2. 左右が同じ → 下（5と5は上で処理済み）
  if (leftNumber === rightNumber) {
    return "down";
  }

  // 3. 左右が異なる → 大きい方の方向
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
  messageEl.textContent = `終了！ 最終ポイントは ${score} です。`;

  // 終了したら「もう一度」ボタン表示
  restartBtn.style.display = "block";
}

function getScoreBonusByStreak(streak) {
  if (streak <= 0) return 0;
  // 1〜9 → 1, 10〜19 → 2, 20〜29 → 4, 30〜39 → 8 ...
  const level = Math.floor((streak - 1) / 10); // 0,1,2,3...
  return Math.pow(2, level);
}

function handleArrowInput(direction) {
  if (isGameOver || timeLeft <= 0) return;

  const correctDirection = getCorrectDirection();

  if (direction === correctDirection) {
    // 正解：連続正解数を増やして、倍率に応じて加点
    streakCount++;
    const bonus = getScoreBonusByStreak(streakCount);
    score += bonus;
    messageEl.textContent = `正解！ +${bonus}（連続 ${streakCount}）`;
  } else {
    // 不正解：スコアは常に -1、連続正解数はリセット
    score -= 1;
    streakCount = 0;
    messageEl.textContent = "まちがい… -1（連続正解リセット）";
  }

  updateScore();
  setNewNumbers();
}

function startGame() {
  // スタート画面を消す
  if (startOverlay) {
    startOverlay.style.display = "none";
  }

  // ゲーム状態初期化
  score = 0;
  timeLeft = 60;
  isGameOver = false;
  streakCount = 0;
  messageEl.textContent = "";
  restartBtn.style.display = "none";

  updateScore();
  updateTime();

  setButtonsEnabled(true);
  setNewNumbers();
  startTimer();
}

function restartGame() {
  startGame();
}

function attachHandlers() {
  arrowButtons.forEach((btn) => {
    const direction = btn.dataset.direction;
    btn.addEventListener("pointerup", () => {
      handleArrowInput(direction);
    });
  });

  startBtn.addEventListener("pointerup", startGame);
  restartBtn.addEventListener("pointerup", restartGame);
}

function initGame() {
  leftNumberEl = document.getElementById("left-number");
  rightNumberEl = document.getElementById("right-number");
  scoreEl = document.getElementById("score");
  timeEl = document.getElementById("time");
  messageEl = document.getElementById("message");
  startOverlay = document.getElementById("start-overlay");
  startBtn = document.getElementById("start-btn");
  restartBtn = document.getElementById("restart-btn");
  arrowButtons = document.querySelectorAll(".arrow-btn");

  // 初期状態では矢印は無効のまま
  setButtonsEnabled(false);

  attachHandlers();
}

document.addEventListener("DOMContentLoaded", initGame);
