/**
 * 获取 DOM 元素
 */
export function $(selector) {
  return document.querySelector(selector);
}

export function $$(selector) {
  return document.querySelectorAll(selector);
}
