import { $ } from "../utils/tool.js";

let timerInterval = null;
let seconds = 0;
let started = false;

const timerDom = $(".timer");

/**
 * 开始计时
 */
export function startTimer() {
  if (started) return;
  started = true;
  timerInterval = setInterval(() => {
    seconds++;
    timerDom.innerHTML = seconds;
  }, 1000);
}

/**
 * 停止计时并返回用时
 */
export function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  started = false;
  return seconds;
}

/**
 * 重置计时器
 */
export function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  started = false;
  seconds = 0;
  timerDom.innerHTML = "0";
}
