"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getThrowMessage;
/**
 * 获取抛错信息
 * @param e 抛错数据
 * @param defaultValue
 * @returns {string}
 */
function getThrowMessage(e, defaultValue = 'Operation Failed') {
  let message = '';
  if (e) {
    if (typeof e === 'object') {
      message = e.errMsg || e.message;
    } else if (typeof e === 'string') {
      message = e;
    }
  }
  return String(message || defaultValue);
}