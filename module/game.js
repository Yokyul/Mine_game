import { $, $$ } from "../utils/tool.js";
import { config } from "../config/index.js";
import { mineAreaDom, showMap } from "./ui.js";
import { searchArea, startFlag } from "./play.js";

export let curLevel = config.easy; // 游戏难度

/**
 * 游戏初始化
 */
export function init() {
  showMap();

  // 因为游戏结束会移除事件。所以每次初始化时，都要重新绑定事件
  mineAreaDom.onmousedown = function (e) {
    // 点击鼠标左键，进行区域搜索
    if (e.button === 0) {
      searchArea(e.target);
    }

    // 点击鼠标右键，进行插旗操作
    if (e.button === 2) {
      startFlag(e.target);
    }
  };
}

/**
 * 绑定事件
 */
export function bindEvent() {
  // 阻止默认的鼠标右键行为，默认会弹出右键菜单
  mineAreaDom.oncontextmenu = function (e) {
    e.preventDefault();
  };

  // 切换游戏难度
  $(".level").onclick = function (e) {
    const levelBtnDoms = $$(".level > button");
    for (let i = 0; i < levelBtnDoms.length; i++) {
      levelBtnDoms[i].classList.remove("active");
    }
    e.target.classList.add("active");

    switch (e.target.innerHTML) {
      case "初级":
        curLevel = config.easy;
        break;
      case "中级":
        curLevel = config.normal;
        break;
      case "高级":
        curLevel = config.hard;
        break;
    }

    init();
  };
}

export function removeEvent() {
  mineAreaDom.onmousedown = null;
}
