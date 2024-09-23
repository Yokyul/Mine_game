import { $ } from "../utils/tool.js";
import { curLevel } from "./game.js";
import { clearFlagArray } from "./play.js";

/**
 * 雷区的外层容器
 */
export const mineAreaDom = $(".mineArea");

/**
 * 插旗数量的 DOM 元素
 */
const flagNumDom = $(".flagNum");

/**
 * 修改页面上剩余旗帜数量
 */
export function changeFlagNum(len) {
  flagNumDom.innerHTML = len;
}

/**
 * 总雷数的 DOM 元素
 */
const mineNumDom = $(".mineNum");

export let tableData = []; // 用于存储整张地图每个格子额外的一些信息

/**
 * 显示地图
 */
export function showMap() {
  // 1. 场景重置
  clearScene();

  // 2. 随机生成所选配置对应数量的雷
  const mineArray = initMine();
  // console.log("有雷格子的索引", mineArray);

  // 3. 生成所选配置的表格
  const table = createTable(mineArray);
  mineAreaDom.appendChild(table);
}

/**
 * 场景重置
 */
function clearScene() {
  mineAreaDom.innerHTML = "";
  mineNumDom.innerHTML = curLevel.mineNum; // 重置当前级别的雷数
  changeFlagNum(0); // 重置插旗的数量
  clearFlagArray(); // 清空插旗的数组
}

/**
 * 返回一个数组，记录所有地雷对应的地图格子索引
 */
function initMine() {
  // 获取对应难度地图的每个格子的索引数组
  const arr = new Array(curLevel.row * curLevel.col);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = i;
  }

  // 从所有地图格子的索引中 随机截取 对应雷数的长度
  arr.sort(() => 0.5 - Math.random());
  return arr.slice(0, curLevel.mineNum);
}

/**
 * 根据难度动态生成 table
 */
function createTable(mineArray) {
  const table = document.createElement("table");
  let tdIndex = 0; // 格子下标
  for (let i = 0; i < curLevel.row; i++) {
    const tr = document.createElement("tr");
    tableData[i] = [];
    for (let j = 0; j < curLevel.col; j++) {
      const td = document.createElement("td");
      const div = document.createElement("div");

      // 每一个小格子都会对应一个 JS 对象，该对象存储了额外的一些信息
      tableData[i][j] = {
        row: i, // 该格子的行
        col: j, // 该格子的列
        type: "number", // 格子的属性 数字 number 雷 mine
        value: 0, // 周围雷的数量
        index: tdIndex, // 格子的下标
        checked: false // 是否被检验过，后面会用到
      };

      // 为每一个 div 添加一个下标，方便用户点击的时候获取对应格子的下标
      div.dataset.id = tdIndex;
      // 标记当前的 div 是可以插旗的
      div.classList.add("canFlag");

      // 查看当前格子的下标是否在雷的数组里面
      if (mineArray.includes(tableData[i][j].index)) {
        tableData[i][j].type = "mine";
        div.classList.add("mine");
      }

      td.appendChild(div);
      tr.appendChild(td);

      // 下标自增
      tdIndex++;
    }
    table.appendChild(tr);
  }

  // console.log("所有格子信息", tableData);

  return table;
}
