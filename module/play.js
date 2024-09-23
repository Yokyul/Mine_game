import { curLevel, removeEvent } from "./game.js";
import { $$ } from "../utils/tool.js";
import { changeFlagNum, tableData } from "./ui.js";

let flagArray = []; // 存储用户插旗的 DOM 元素

/**
 * 区域搜索
 * @param {*} cell 用户点击的 DOM 元素
 */
export function searchArea(cell) {
  if (cell.classList.contains("mine")) {
    // 当前单元格是雷
    cell.classList.add("error");
    showAnswer();
  } else {
    // 当前单元格不是雷，判断周围一圈有没有雷
    // - 如果有雷，显示雷的数量
    // - 如果没有雷，继续递归搜索
    getAround(cell);
  }
}

/**
 * 搜索该单元周围的九宫格区域
 * @param {*} cell 用户点击的单元格
 */
function getAround(cell) {
  if (cell.classList.contains("flag")) return; // 当前单元格被插旗

  cell.parentNode.style.border = "none";
  cell.classList.remove("canFlag");

  // 1. 获取到该 DOM 元素在 tableData 里面所对应的对象
  let tableItem = getTableItem(cell);
  if (!tableItem) return;
  tableItem.checked = true; // 代表当前的单元格已经被核对过了

  // 2. 根据该对象查看周围一圈是否有雷
  let mineNum = findMineNum(tableItem);
  if (!mineNum) {
    // 周围没有雷，需要继续搜索
    const { rowTop, rowBottom, colLeft, colRight } = getBound(tableItem);
    for (let i = rowTop; i <= rowBottom; i++) {
      for (let j = colLeft; j <= colRight; j++) {
        if (!tableData[i][j].checked) {
          getAround(getDOM(tableData[i][j]));
        }
      }
    }
  } else {
    // 周围有雷，当前的格子要显示对应雷的数量
    let cl = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight"];
    cell.classList.add(cl[mineNum]);
    cell.innerHTML = mineNum;
  }
}

/**
 * 找到对应 DOM 在 tableData 里面的 JS 对象
 * @param {*} cell
 */
function getTableItem(cell) {
  let index = cell.dataset.id;
  let flatTableData = tableData.flat();
  return flatTableData.find(item => item.index == index);
}

/**
 * 返回周围一圈雷的数量
 * @param {*} obj 格子对应的 JS 对象
 */
function findMineNum(obj) {
  const { rowTop, rowBottom, colLeft, colRight } = getBound(obj);
  let count = 0; // 地雷计数器
  for (let i = rowTop; i <= rowBottom; i++) {
    for (let j = colLeft; j <= colRight; j++) {
      if (tableData[i][j].type === "mine") {
        count++;
      }
    }
  }
  return count;
}

/**
 * 会返回该对象对应的四周的边界
 * @param {*} obj 格子对应的 JS 对象
 */
function getBound(obj) {
  // 确定边界

  // 上下边界
  const rowTop = obj.row - 1 < 0 ? 0 : obj.row - 1;
  const rowBottom = obj.row + 1 === curLevel.row ? curLevel.row - 1 : obj.row + 1;

  // 左右边界
  const colLeft = obj.col - 1 < 0 ? 0 : obj.col - 1;
  const colRight = obj.col + 1 === curLevel.col ? curLevel.col - 1 : obj.col + 1;

  return {
    rowTop,
    rowBottom,
    colLeft,
    colRight
  };
}

/**
 * 根据 tableData 中的 JS 对象返回对应的 div
 * @param {*} obj
 */
function getDOM(obj) {
  const divArray = $$("td>div");
  return divArray[obj.index]; // 返回对应下标的 div
}

/**
 * 插旗
 * @param {*} cell 用户点击的 DOM 元素
 */
export function startFlag(cell) {
  // 只有点击的 DOM 元素包含 canFlag 样式类，才能进行插旗操作
  if (cell.classList.contains("canFlag")) {
    if (!flagArray.includes(cell)) {
      // 进行插旗操作
      flagArray.push(cell);
      cell.classList.add("flag");

      // 如果插旗数用完，判断游戏是否获胜
      if (flagArray.length === curLevel.mineNum) {
        showAnswer();
        if (isWin()) {
          gameOver(true);
        }
      }
    } else {
      // 说明这个单元格已经在数组里面了
      // 也就是说，用户现在是要取消插旗
      let index = flagArray.indexOf(cell);
      flagArray.splice(index, 1);
      cell.classList.remove("flag");
    }

    changeFlagNum(flagArray.length);
  }
}

/**
 * 显示答案，即地雷位置
 */
function showAnswer() {
  // 1. 显示所有的雷
  const mineArr = $$("td > div.mine");
  for (let i = 0; i < mineArr.length; i++) {
    mineArr[i].style.opacity = 1;
  }

  // 2. 判断插旗是否正确，正确添加上绿色背景，错误添加上红色背景
  let isAllRight = true;
  for (let i = 0; i < flagArray.length; i++) {
    if (flagArray[i].classList.contains("mine")) {
      // 说明插旗插对了
      flagArray[i].classList.add("right");
    } else {
      flagArray[i].classList.add("error");
      isAllRight = false;
    }
  }

  if (!isAllRight || flagArray.length !== curLevel.mineNum) {
    gameOver(false);
  }

  // 取消事件
  removeEvent();
}

/**
 * 判断用户的插旗是否全部正确
 */
function isWin() {
  for (let i = 0; i < flagArray.length; i++) {
    if (!flagArray[i].classList.contains("mine")) {
      return false;
    }
  }
  return true;
}

/**
 * 游戏结束
 * @param {Boolean} status true 游戏胜利，false 游戏失败
 */
function gameOver(status) {
  const msg = status ? "游戏胜利，你找出了所有的雷～" : "游戏失败～";
  setTimeout(() => {
    alert(msg);
  }, 100);
}

/**
 * 清空旗帜数组
 */
export function clearFlagArray() {
  flagArray = []; // 清空插旗的数组
}
