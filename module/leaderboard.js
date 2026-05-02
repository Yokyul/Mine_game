import { $, $$ } from "../utils/tool.js";

const STORAGE_KEY = "minesweeper_leaderboard";
const MAX_RECORDS = 5;

let currentTab = "easy";

/**
 * 从 localStorage 获取排行榜数据
 */
function getRecords() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { easy: [], normal: [], hard: [] };
}

/**
 * 保存排行榜数据到 localStorage
 */
function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

/**
 * 添加一条记录
 * @param {string} level 难度级别 easy/normal/hard
 * @param {number} time 用时（秒）
 */
export function addRecord(level, time) {
  const records = getRecords();
  records[level].push({
    time: time,
    date: new Date().toLocaleDateString("zh-CN")
  });
  records[level].sort((a, b) => a.time - b.time);
  records[level] = records[level].slice(0, MAX_RECORDS);
  saveRecords(records);
  renderLeaderboard();
}

/**
 * 渲染排行榜
 */
export function renderLeaderboard() {
  const records = getRecords();
  const tbody = $(".lb-body");
  const emptyTip = $(".lb-empty");
  const list = records[currentTab];

  tbody.innerHTML = "";

  if (list.length === 0) {
    emptyTip.style.display = "block";
    tbody.parentElement.style.display = "none";
  } else {
    emptyTip.style.display = "none";
    tbody.parentElement.style.display = "table";
    list.forEach((record, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${index + 1}</td><td>${record.time}</td><td>${record.date}</td>`;
      tbody.appendChild(tr);
    });
  }
}

/**
 * 初始化排行榜事件绑定
 */
export function initLeaderboard() {
  renderLeaderboard();

  const tabs = $$(".lb-tab");
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].onclick = function () {
      for (let j = 0; j < tabs.length; j++) {
        tabs[j].classList.remove("active");
      }
      this.classList.add("active");
      currentTab = this.dataset.level;
      renderLeaderboard();
    };
  }
}
