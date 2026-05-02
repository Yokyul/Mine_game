import { init, bindEvent } from "./module/game.js";
import { initLeaderboard } from "./module/leaderboard.js";

// 1. 初始化
init();

// 2. 绑定事件
bindEvent();

// 3. 初始化排行榜
initLeaderboard();
